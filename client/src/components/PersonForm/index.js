import './index.scss';
import FormField from '@/components/FormField';

// @vue/component
export default {
    name: 'PersonForm',
    components: { FormField },
    props: {
        person: Object,
        errors: Object,
        withCompany: Boolean,
        withReference: Boolean,
    },
    computed: {
        countriesOptions() {
            return this.$store.getters['countries/options'];
        },

        companiesOptions() {
            return this.$store.getters['companies/options'];
        },
    },
    mounted() {
        this.$store.dispatch('countries/fetch');
        this.$store.dispatch('companies/fetch');
    },
    methods: {
        doSubmit(e) {
            this.$emit('submit', e);
        },

        handleChange(e) {
            this.$emit('change', e);
        },

        goBack() {
            this.$emit('cancel');
            this.$router.back();
        },
    },
};
