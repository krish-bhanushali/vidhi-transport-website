export type Field = {
  name: string; label: string; type?: string; required?: boolean; autocomplete?: string; inputmode?: string;
  placeholder?: string; options?: string[]; full?: boolean; hint?: string; textarea?: boolean; min?: string; pattern?: string;
};
export type Fieldset = { legend: string; fields: Field[] };

const SERVICES = ['Please recommend', 'Full Truckload Transport', 'Part Load Transport', 'Reverse Logistics', 'Chemical & Industrial Freight', 'First-Mile & Last-Mile Support', 'Project Cargo Transport', 'ODC & Construction Cargo', 'Port Container Transport', 'Warehousing & Distribution'];
const BILLING = ['Please advise', 'Paid', 'To Pay', 'Account billing'];
const DELIVERY = ['Please advise', 'Door to door', 'Godown to door', 'Godown to godown', 'Delivery Against Consignee Copy (DACC)', 'Cash On Delivery (COD)', 'Other combination'];

/** Fields mirror the live contact_us.html quotation form. */
export const quoteForm: Fieldset[] = [
  { legend: 'Business contact', fields: [
    { name: 'name', label: 'Your name', required: true, autocomplete: 'name' },
    { name: 'company', label: 'Company', required: true, autocomplete: 'organization' },
    { name: 'designation', label: 'Designation', autocomplete: 'organization-title' },
    { name: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel' },
    { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', full: true },
  ] },
  { legend: 'Route and service', fields: [
    { name: 'origin', label: 'Origin', required: true, placeholder: 'Industrial area and PIN code' },
    { name: 'destination', label: 'Destination', required: true, placeholder: 'Industrial area and PIN code' },
    { name: 'service', label: 'Service', required: true, options: SERVICES, full: true },
  ] },
  { legend: 'Cargo details', fields: [
    { name: 'material', label: 'Material', required: true, placeholder: 'Material / goods description' },
    { name: 'packaging', label: 'Packaging', required: true, placeholder: 'Cartons, bags, drums, carboys…' },
    { name: 'packages', label: 'Packages', type: 'number', required: true, inputmode: 'numeric', min: '1' },
    { name: 'weight', label: 'Total gross weight', required: true, placeholder: 'Example: 1,250 kg' },
    { name: 'dimensions', label: 'Dimensions / vehicle', placeholder: 'Package dimensions or preferred vehicle' },
    { name: 'dispatch_date', label: 'Dispatch date', type: 'date' },
    { name: 'billing', label: 'Billing option', options: BILLING },
    { name: 'delivery', label: 'Delivery option', options: DELIVERY },
    { name: 'message', label: 'Requirement details', textarea: true, full: true, placeholder: 'Handling, forklift/crane, documents, receiving appointment, urgency or recurring volume' },
  ] },
];

/** Mirrors the live pickup-request.html form. */
export const pickupForm: Fieldset[] = [
  { legend: 'Route and timing', fields: [
    { name: 'pickup_company', label: 'Pickup company', required: true, autocomplete: 'organization' },
    { name: 'pickup_date', label: 'Preferred pickup date', type: 'date', required: true },
    { name: 'pickup_address', label: 'Pickup address', textarea: true, required: true, full: true, autocomplete: 'street-address' },
    { name: 'pickup_pincode', label: 'Pickup PIN code', required: true, inputmode: 'numeric', pattern: '[0-9]{6}', hint: '6-digit PIN code' },
    { name: 'destination_pincode', label: 'Destination PIN code', required: true, inputmode: 'numeric', pattern: '[0-9]{6}', hint: '6-digit PIN code' },
    { name: 'destination', label: 'Destination / consignee address', textarea: true, required: true, full: true },
  ] },
  { legend: 'Cargo and movement', fields: [
    { name: 'service', label: 'Preferred service', required: true, options: SERVICES.filter((s) => s !== 'Project Cargo Transport'), full: true },
    { name: 'material', label: 'Material / goods', required: true },
    { name: 'packaging', label: 'Packaging', required: true, options: ['Cartons', 'Bags', 'Pallets', 'Drums', 'Carboys', 'IBCs', 'Loose / unpacked', 'Other'] },
    { name: 'packages', label: 'Number of packages', type: 'number', required: true, inputmode: 'numeric', min: '1' },
    { name: 'weight', label: 'Total gross weight', required: true, placeholder: 'Example: 1,250 kg' },
    { name: 'dimensions', label: 'Dimensions / space', placeholder: 'L × W × H per package', full: true },
    { name: 'billing', label: 'Billing option', options: BILLING },
    { name: 'delivery', label: 'Delivery option', options: DELIVERY },
    { name: 'notes', label: 'Handling, documents or special instructions', textarea: true, full: true, placeholder: 'Forklift, crane, loading hours, SDS, regulated cargo, non-stackable material or receiving appointment' },
  ] },
  { legend: 'Your contact', fields: [
    { name: 'contact_name', label: 'Contact name', required: true, autocomplete: 'name' },
    { name: 'phone', label: 'Mobile number', type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel' },
    { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email' },
    { name: 'branch', label: 'Preferred branch', placeholder: 'Example: Ankleshwar' },
  ] },
];

/** Mirrors the live service-complaint.html fields (the live PHP endpoint returns 404; see docs). */
export const complaintForm: Fieldset[] = [
  { legend: 'Customer details', fields: [
    { name: 'customer', label: 'Customer / company', required: true, autocomplete: 'organization' },
    { name: 'contact_person', label: 'Contact person', required: true, autocomplete: 'name' },
    { name: 'address', label: 'Address', textarea: true, full: true, autocomplete: 'street-address' },
    { name: 'city', label: 'City', autocomplete: 'address-level2' },
    { name: 'state', label: 'State', autocomplete: 'address-level1' },
    { name: 'pincode', label: 'PIN code', required: true, inputmode: 'numeric', autocomplete: 'postal-code', pattern: '[0-9]{6}' },
    { name: 'telephone', label: 'Telephone', type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel' },
    { name: 'mobile', label: 'Mobile number', type: 'tel', required: true, inputmode: 'tel' },
    { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email' },
  ] },
  { legend: 'Complaint details', fields: [
    { name: 'complaint_type', label: 'Complaint type', required: true, full: true, options: ['Claim', 'Damage', 'Detention / demurrage', 'Missing document', 'Freight charge query', 'Staff conduct', 'Non-delivery', 'COD / DACC issue', 'POD not received', 'Short receipt', 'Shipment lost', 'Interchanged goods', 'Weight difference', 'Delivery mode or location', 'Other'] },
    { name: 'lr_detail', label: 'LR number / details', required: true },
    { name: 'issue_date', label: 'Date issue was noticed', type: 'date' },
    { name: 'origin', label: 'Origin' },
    { name: 'destination', label: 'Destination' },
    { name: 'describe', label: 'Describe the complaint', textarea: true, required: true, full: true, placeholder: 'What happened, when it was noticed and the resolution requested' },
  ] },
];

/** Homepage quick enquiry (live index.html quote form). */
export const quickForm: Fieldset[] = [
  { legend: 'Quick freight enquiry', fields: [
    { name: 'name', label: 'Your name', required: true, autocomplete: 'name' },
    { name: 'phone', label: 'Phone number', type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel' },
    { name: 'origin', label: 'Pickup location', required: true, placeholder: 'City or industrial area' },
    { name: 'destination', label: 'Delivery location', required: true, placeholder: 'City or industrial area' },
    { name: 'service', label: 'Service required', options: SERVICES, full: true },
    { name: 'details', label: 'Cargo details', textarea: true, full: true, placeholder: 'Cargo type, approximate weight, dimensions or dispatch date' },
  ] },
];
