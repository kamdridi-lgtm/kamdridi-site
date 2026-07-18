export type FulfillmentProvider =
  | 'kunaki'
  | 'printful'
  | 'lulu'
  | 'diggers_factory'
  | 'manual_supplier'
  | 'digital_internal';

export type SupplierStatus =
  | 'candidate'
  | 'account_required'
  | 'prototype_required'
  | 'mapping_required'
  | 'ready'
  | 'paused';

export type AssetStatus =
  | 'missing'
  | 'partial'
  | 'review_required'
  | 'print_ready';

export type PrototypeStatus =
  | 'not_ordered'
  | 'ordered'
  | 'received'
  | 'approved'
  | 'rejected';

export type FulfillmentComponentProfile = {
  componentId: string;
  name: string;
  provider: FulfillmentProvider;
  supplierStatus: SupplierStatus;
  providerProductId: string | null;
  assetStatus: AssetStatus;
  prototypeStatus: PrototypeStatus;
  automaticSubmission: boolean;
  missingRequirements: string[];
};

export type ProductFulfillmentProfile = {
  productId: string;
  provider: FulfillmentProvider;
  supplierStatus: SupplierStatus;
  providerProductId: string | null;
  providerVariantIds: Record<string, string>;
  assetStatus: AssetStatus;
  prototypeStatus: PrototypeStatus;
  automaticSubmission: boolean;
  supportsDirectShipping: boolean;
  requiresManualApproval: boolean;
  productionNotes: string;
  missingRequirements: string[];
  components?: FulfillmentComponentProfile[];
};

export const fulfillmentProfiles: ProductFulfillmentProfile[] = [
  {
    productId: 'salieri-collector-cd',
    provider: 'kunaki',
    supplierStatus: 'candidate',
    providerProductId: null,
    providerVariantIds: {},
    assetStatus: 'missing',
    prototypeStatus: 'not_ordered',
    automaticSubmission: false,
    supportsDirectShipping: true,
    requiresManualApproval: true,
    productionNotes: 'CD prototype Kunaki',
    missingRequirements: []
  },
  {
    productId: 'echoes-brasil-expanded-2026',
    provider: 'manual_supplier',
    supplierStatus: 'candidate',
    providerProductId: null,
    providerVariantIds: {},
    assetStatus: 'missing',
    prototypeStatus: 'not_ordered',
    automaticSubmission: false,
    supportsDirectShipping: false,
    requiresManualApproval: true,
    productionNotes: '',
    missingRequirements: [
      'confirmer le format physique exact',
      'confirmer CD, vinyle ou autre support',
      'confirmer le contenu',
      'confirmer le packaging'
    ]
  },
  {
    productId: 'echoes-brasil-livreto-2026',
    provider: 'lulu',
    supplierStatus: 'prototype_required',
    providerProductId: null,
    providerVariantIds: {},
    assetStatus: 'missing',
    prototypeStatus: 'not_ordered',
    automaticSubmission: false,
    supportsDirectShipping: true,
    requiresManualApproval: true,
    productionNotes: 'Livret Lulu',
    missingRequirements: []
  },
  {
    productId: 'salieri-hardcover-booklet',
    provider: 'lulu',
    supplierStatus: 'prototype_required',
    providerProductId: null,
    providerVariantIds: {},
    assetStatus: 'missing',
    prototypeStatus: 'not_ordered',
    automaticSubmission: false,
    supportsDirectShipping: true,
    requiresManualApproval: true,
    productionNotes: 'Livret Lulu',
    missingRequirements: []
  },
  {
    productId: 'echoes-brasil-deluxe-2026',
    provider: 'manual_supplier',
    supplierStatus: 'prototype_required',
    providerProductId: null,
    providerVariantIds: {},
    assetStatus: 'missing',
    prototypeStatus: 'not_ordered',
    automaticSubmission: false,
    supportsDirectShipping: false,
    requiresManualApproval: true,
    productionNotes: 'Boite et carton en manual_supplier, composante vinyle via Diggers Factory',
    missingRequirements: [],
    components: [
      {
        componentId: 'vinyl',
        name: 'Vinyle',
        provider: 'diggers_factory',
        supplierStatus: 'prototype_required',
        providerProductId: null,
        assetStatus: 'missing',
        prototypeStatus: 'not_ordered',
        automaticSubmission: false,
        missingRequirements: []
      },
      {
        componentId: 'box-and-inserts',
        name: 'Boîte et inserts',
        provider: 'manual_supplier',
        supplierStatus: 'prototype_required',
        providerProductId: null,
        assetStatus: 'missing',
        prototypeStatus: 'not_ordered',
        automaticSubmission: false,
        missingRequirements: []
      }
    ]
  },
  {
    productId: 'salieri-vinyl-edition',
    provider: 'diggers_factory',
    supplierStatus: 'prototype_required',
    providerProductId: null,
    providerVariantIds: {},
    assetStatus: 'missing',
    prototypeStatus: 'not_ordered',
    automaticSubmission: false,
    supportsDirectShipping: false,
    requiresManualApproval: true,
    productionNotes: 'Vinyle standard',
    missingRequirements: []
  },
  {
    productId: 'salieri-collector-bundle',
    provider: 'manual_supplier',
    supplierStatus: 'prototype_required',
    providerProductId: null,
    providerVariantIds: {},
    assetStatus: 'missing',
    prototypeStatus: 'not_ordered',
    automaticSubmission: false,
    supportsDirectShipping: false,
    requiresManualApproval: true,
    productionNotes: '',
    missingRequirements: []
  },
  {
    productId: 'salieri-special-edition-box',
    provider: 'manual_supplier',
    supplierStatus: 'prototype_required',
    providerProductId: null,
    providerVariantIds: {},
    assetStatus: 'missing',
    prototypeStatus: 'not_ordered',
    automaticSubmission: false,
    supportsDirectShipping: false,
    requiresManualApproval: true,
    productionNotes: '',
    missingRequirements: []
  },
  {
    productId: 'salieri-collector-coin',
    provider: 'manual_supplier',
    supplierStatus: 'prototype_required',
    providerProductId: null,
    providerVariantIds: {},
    assetStatus: 'missing',
    prototypeStatus: 'not_ordered',
    automaticSubmission: false,
    supportsDirectShipping: false,
    requiresManualApproval: true,
    productionNotes: '',
    missingRequirements: []
  },
  {
    productId: 'kamdridi-logo-keychain',
    provider: 'manual_supplier',
    supplierStatus: 'prototype_required',
    providerProductId: null,
    providerVariantIds: {},
    assetStatus: 'missing',
    prototypeStatus: 'not_ordered',
    automaticSubmission: false,
    supportsDirectShipping: false,
    requiresManualApproval: true,
    productionNotes: '',
    missingRequirements: []
  },
  {
    productId: 'war-machines-collector-artifact',
    provider: 'manual_supplier',
    supplierStatus: 'prototype_required',
    providerProductId: null,
    providerVariantIds: {},
    assetStatus: 'missing',
    prototypeStatus: 'not_ordered',
    automaticSubmission: false,
    supportsDirectShipping: false,
    requiresManualApproval: true,
    productionNotes: '',
    missingRequirements: []
  },
  {
    productId: 'salieri-digital-release',
    provider: 'digital_internal',
    supplierStatus: 'ready',
    providerProductId: null,
    providerVariantIds: {},
    assetStatus: 'print_ready',
    prototypeStatus: 'approved',
    automaticSubmission: false,
    supportsDirectShipping: true,
    requiresManualApproval: false,
    productionNotes: '',
    missingRequirements: []
  },
  {
    productId: 'the-gilded-null-license',
    provider: 'digital_internal',
    supplierStatus: 'ready',
    providerProductId: null,
    providerVariantIds: {},
    assetStatus: 'print_ready',
    prototypeStatus: 'approved',
    automaticSubmission: false,
    supportsDirectShipping: true,
    requiresManualApproval: false,
    productionNotes: '',
    missingRequirements: []
  },
  {
    productId: 'vault-sequence-license',
    provider: 'digital_internal',
    supplierStatus: 'ready',
    providerProductId: null,
    providerVariantIds: {},
    assetStatus: 'print_ready',
    prototypeStatus: 'approved',
    automaticSubmission: false,
    supportsDirectShipping: true,
    requiresManualApproval: false,
    productionNotes: '',
    missingRequirements: []
  }
];

const printfulProducts = [
  'salieri-hoodie',
  'salieri-tee',
  'salieri-mug',
  'salieri-poster',
  'kamdridi-gold-logo-tee',
  'kamdridi-gold-logo-hoodie',
  'kamdridi-logo-snapback',
  'kamdridi-logo-mug',
  'echoes-unearthed-crest-tee',
  'echoes-unearthed-wordmark-tee',
  'signal-target-tee-collection',
  'war-machines-mini-poster',
  'official-tee-picture'
];

printfulProducts.forEach(id => {
  fulfillmentProfiles.push({
    productId: id,
    provider: 'printful',
    supplierStatus: 'mapping_required',
    providerProductId: null,
    providerVariantIds: {},
    assetStatus: 'missing',
    prototypeStatus: 'not_ordered',
    automaticSubmission: false,
    supportsDirectShipping: true,
    requiresManualApproval: true,
    productionNotes: 'Printful Candidate',
    missingRequirements: []
  });
});
