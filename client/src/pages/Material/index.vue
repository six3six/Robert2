<template>
    <div class="content">
        <div class="content__main-view">
            <div class="Material">
                <form
                    class="Form Form--fixed-actions Material__form"
                    method="POST"
                    @submit="saveMaterial"
                    @change="handleFormChange"
                    :key="entitiesState"
                >
                    <section class="Form__fieldset">
                        <h4 class="Form__fieldset__title">
                            {{ $t('minimal-infos') }}
                            <span class="FormField__label__required">*</span>
                        </h4>
                        <FormField
                            v-model="material.name"
                            name="name"
                            label="name"
                            required
                            :errors="errors.name"
                        />
                        <FormField
                            v-model="material.reference"
                            name="reference"
                            label="reference"
                            required
                            class="Material__ref"
                            :errors="errors.reference"
                        />
                        <FormField
                            v-model="material.park_id"
                            name="park_id"
                            label="park"
                            type="select"
                            required
                            :options="parksOptions"
                            :errors="errors.park_id"
                        />
                        <FormField
                            v-model="material.category_id"
                            name="category_id"
                            label="category"
                            type="select"
                            required
                            :options="categoriesOptions"
                            :errors="errors.category_id"
                            @change="handleCategoryChange"
                        />
                        <FormField
                            v-model="material.sub_category_id"
                            name="sub_category_id"
                            label="sub-category"
                            type="select"
                            :options="subCategoriesOptions"
                            :errors="errors.sub_category_id"
                        />
                        <FormField
                            v-show="showBilling"
                            v-model="material.rental_price"
                            name="rental_price"
                            label="rental-price"
                            type="number"
                            :addon="currency"
                            required
                            class="Material__price"
                            :errors="errors.rental_price"
                            @input="updateRentalPrice"
                        />
                        <FormField
                            v-model="material.stock_quantity"
                            name="stock_quantity"
                            label="quantity"
                            type="number"
                            :step="1"
                            required
                            class="Material__quantity"
                            :errors="errors.stock_quantity"
                        />
                    </section>
                    <section class="Form__fieldset">
                        <h4 class="Form__fieldset__title">
                            {{ $t('extra-infos') }}
                        </h4>
                        <FormField
                            v-model="material.description"
                            name="description"
                            label="description"
                            type="textarea"
                            :errors="errors.description"
                        />
                        <FormField
                            v-model="material.replacement_price"
                            name="replacement_price"
                            label="replacement-price"
                            type="number"
                            :addon="currency"
                            class="Material__price"
                            :errors="errors.replacement_price"
                        />
                        <FormField
                            v-model="material.out_of_order_quantity"
                            name="out_of_order_quantity"
                            label="quantity-out-of-order"
                            type="number"
                            :step="1"
                            class="Material__quantity"
                            :errors="errors.out_of_order_quantity"
                        />
                        <FormField
                            v-model="material.note"
                            name="note"
                            label="notes"
                            type="textarea"
                            :errors="errors.note"
                        />
                    </section>
                    <section v-if="showBilling" class="Form__fieldset">
                        <h4 class="Form__fieldset__title">
                            {{ $t('billing-infos') }}
                        </h4>
                        <FormField
                            v-model="material.is_discountable"
                            name="is_discountable"
                            label="discountable"
                            type="switch"
                            :errors="errors.is_discountable"
                        />
                        <FormField
                            v-model="material.is_hidden_on_bill"
                            name="is_hidden_on_bill"
                            :disabled="material.rental_price > 0"
                            :disabledReason="$t('price-must-be-zero')"
                            label="hidden-on-bill"
                            type="switch"
                            :errors="errors.is_hidden_on_bill"
                        />
                    </section>
                    <section class="Form__fieldset">
                        <h4 class="Form__fieldset__title">
                            {{ $t('special-attributes') }}
                        </h4>
                        <p v-if="extraAttributes.length === 0" class="Material__no-attribute-help">
                            {{ $t('page-attributes.no-attribute-yet') }}
                        </p>
                        <div v-if="extraAttributes.length > 0" class="Material__attributes">
                            <FormField
                                v-for="extraAttribute in extraAttributes"
                                :key="extraAttribute.id"
                                v-model="materialAttributes[extraAttribute.id]"
                                :name="extraAttribute.name"
                                :label="extraAttribute.name"
                                :addon="extraAttribute.unit"
                                :type="getAttributeType(extraAttribute.type)"
                                @change="handleAttributeChange"
                            />
                        </div>
                        <p v-if="!material.category_id" class="Material__attributes-help">
                            <i class="fas fa-info-circle Material__attributes-help__icon" />
                            {{ $t('page-materials.more-attribute-when-category-selected') }}
                        </p>
                        <router-link
                            v-if="isAdmin"
                            to="/attributes"
                            class="Material__modify-attribute-link"
                        >
                            <i class="fas fa-plus" /> {{ $t('page-attributes.add-attributes') }}
                        </router-link>
                    </section>
                    <section class="Form__actions">
                        <button class="Form__actions__save success" type="submit">
                            <i class="fas fa-save" />
                            {{ $t('save') }}
                        </button>
                        <button type="button" @click="handleCancel">
                            <i class="fas fa-ban" />
                            {{ $t('cancel') }}
                        </button>
                    </section>
                </form>
                <section class="Material__side">
                    <Help :message="help" :error="error" :isLoading="isLoading" />
                    <ImageWithUpload
                        :url="pictureUrl"
                        :name="material.picture"
                        @changePicture="handleChangePicture"
                        @resetPicture="handleResetPicture"
                        :isLoading="isUploading"
                        :error="uploadError"
                    />
                    <Progressbar v-if="isUploading" :percent="uploadProgress" />
                </section>
            </div>
        </div>
    </div>
</template>

<script src="./index.js"></script>
