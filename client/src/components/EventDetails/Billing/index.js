import Help from '@/components/Help';
import EventBilling from '@/components/EventBilling';
import EventNotBillable from '@/components/EventNotBillable';

// @vue/component
export default {
    name: 'EventDetailsBilling',
    props: {
        event: { type: Object, required: true },
    },
    data: () => ({
        isCreating: false,
        isLoading: false,
        successMessage: null,
        error: null,
    }),
    computed: {
        hasMaterials() {
            return this.event?.materials?.length > 0;
        },
    },
    methods: {
        async handleCreateBill(discountRate) {
            if (this.isLoading || this.isCreating) {
                return;
            }

            try {
                this.error = null;
                this.successMessage = null;
                this.isCreating = true;

                const { id } = this.event;
                const { data } = await this.$http.post(`events/${id}/bill`, { discountRate });

                this.$emit('createBill', data);
                this.successMessage = this.$t('bill-created');
            } catch (error) {
                this.error = error;
            } finally {
                this.isCreating = false;
            }
        },
    },
    render() {
        const {
            event,
            successMessage,
            error,
            hasMaterials,
            isCreating,
            handleCreateBill,
        } = this;

        return (
            <div class="EventDetailsBilling">
                <Help message={{ type: 'success', text: successMessage }} error={error} />
                {hasMaterials && event.is_billable && (
                    <EventBilling
                        event={event}
                        loading={isCreating}
                        onCreateBill={handleCreateBill}
                    />
                )}
                {!event.is_billable && (
                    <EventNotBillable
                        eventId={event.id}
                        isEventConfirmed={event.is_confirmed}
                        onBillingEnabled={(data) => {
                            this.$emit('billingEnabled', data);
                        }}
                    />
                )}
            </div>
        );
    },
};
