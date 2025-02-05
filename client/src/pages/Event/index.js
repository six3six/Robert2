import './index.scss';
import Help from '@/components/Help';
import EventStore from './EventStore';
import Breadcrumb from './Breadcrumb';
import MiniSummary from './MiniSummary';
import EventStep1 from './Step1';
import EventStep2 from './Step2';
import EventStep3 from './Step3';
import EventStep4 from './Step4';
import EventStep5 from './Step5';

// @vue/component
export default {
    name: 'Event',
    components: {
        Help,
        Breadcrumb,
        MiniSummary,
        EventStep1,
        EventStep2,
        EventStep3,
        EventStep4,
        EventStep5,
    },
    data() {
        const currentUser = this.$store.state.auth.user;

        return {
            help: 'page-events.help-edit',
            error: null,
            isLoading: false,
            steps: [
                {
                    id: 1,
                    name: this.$t('page-events.event-informations'),
                    fields: ['title', 'start_date', 'end_date'],
                },
                {
                    id: 2,
                    name: this.$t('page-events.event-beneficiaries'),
                    fields: ['beneficiaries'],
                },
                {
                    id: 3,
                    name: this.$t('page-events.event-technicians'),
                    fields: ['technicians'],
                },
                {
                    id: 4,
                    name: this.$t('page-events.event-materials'),
                    fields: ['materials'],
                },
                {
                    id: 5,
                    name: this.$t('page-events.event-summary'),
                    fields: ['title', 'start_date', 'end_date', 'beneficiaries', 'materials'],
                },
            ],
            currentStep: 1,
            event: {
                id: this.$route.params.id || null,
                title: '',
                start_date: this.$route.query.atDate || '',
                end_date: this.$route.query.atDate || '',
                location: '',
                description: '',
                is_confirmed: false,
                user_id: currentUser.id,
                is_billable: true,
                beneficiaries: [],
                technicians: [],
                materials: [],
            },
        };
    },
    computed: {
        isNew() {
            const { id } = this.event;
            return !id || id === 'new';
        },
    },
    mounted() {
        this.getEventData();
        EventStore.commit('reset');
    },
    methods: {
        getEventData() {
            if (this.isNew) {
                return;
            }

            this.startLoading();

            const { id } = this.event;
            const { resource } = this.$route.meta;

            this.$http.get(`${resource}/${id}`)
                .then(({ data }) => {
                    this.setEventData(data, { from: 'get' });
                    this.stopLoading();
                })
                .catch(this.displayError);
        },

        setEventData(data, options = { from: 'save' }) {
            if (options.from === 'get') {
                this.help = 'page-events.help-edit';
            } else {
                this.help = { type: 'success', text: 'page-events.saved' };
            }
            this.error = null;
            this.isLoading = false;
            this.event = data;
            this.$store.commit('setPageSubTitle', this.event.title);
            EventStore.commit('init', this.event);
        },

        openStep(stepId) {
            this.currentStep = stepId;
        },

        startLoading() {
            this.isLoading = true;
        },

        stopLoading() {
            this.isLoading = false;
        },

        displayError(error) {
            this.error = error;
            this.isLoading = false;
        },
    },
};
