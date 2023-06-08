export function get_data_object_for_fournisseur_general_info_update_event(
  lastOrderTime,
  fournisseur,
  category,
  delivers_monday,
  delivers_tuesday,
  delivers_wednesday,
  delivers_thursday,
  delivers_friday,
  delivers_saturday,
  delivers_sunday,
  specialty
) {
  console.log(lastOrderTime);

  // Get data from the form.

  let data = {};
  if (lastOrderTime && lastOrderTime != fournisseur.last_order_time) {
    console.log("HERE");
    data["last_order_time"] = lastOrderTime;
  }
  if (delivers_monday != fournisseur.delivers_monday) {
    data["delivers_monday"] = delivers_monday;
  }
  if (delivers_tuesday != fournisseur.delivers_tuesday) {
    data["delivers_tuesday"] = delivers_tuesday;
  }
  if (delivers_wednesday != fournisseur.delivers_wednesday) {
    data["delivers_wednesday"] = delivers_wednesday;
  }
  if (delivers_thursday != fournisseur.delivers_thursday) {
    data["delivers_thursday"] = delivers_thursday;
  }
  if (delivers_friday != fournisseur.delivers_friday) {
    data["delivers_friday"] = delivers_friday;
  }
  if (delivers_saturday != fournisseur.delivers_saturday) {
    data["delivers_saturday"] = delivers_saturday;
  }
  if (delivers_sunday != fournisseur.delivers_sunday) {
    data["delivers_sunday"] = delivers_sunday;
  }
  if (category.value != fournisseur.category) {
    data["category"] = category.value;
  }
  if (specialty.label != fournisseur.specialty) {
    data["specialty"] = specialty.label;
  }
  console.log(data);
  return data;
}

export function get_data_object_for_fournisseur_fiche_contact_update_event(
  event,
  fournisseur
) {
  let data = {};
  if (event.address && event.address.value != fournisseur.address) {
    data["address"] = event.address.value;
  }
  if (
    event.address_line_2 &&
    event.address_line_2.value != fournisseur.address_line_2
  ) {
    data["address_line_2"] = event.address_line_2.value;
  }
  if (event.postal_code && event.postal_code.value != fournisseur.postal_code) {
    data["postal_code"] = event.postal_code.value;
  }
  if (event.city && event.city.value != fournisseur.city) {
    data["city"] = event.city.value;
  }
  if (event.department && event.department.value != fournisseur.department) {
    data["department"] = event.department.value;
  }
  if (event.country && event.country.value != fournisseur.country) {
    data["country"] = event.country.value;
  }
  if (event.client_code && event.client_code.value != fournisseur.client_code) {
    data["client_code"] = event.client_code.value;
  }
  if (
    event.principal_phone_number &&
    event.principal_phone_number.value != fournisseur.principal_phone_number
  ) {
    data["principal_phone_number"] = event.principal_phone_number.value;
  }
  if (
    event.ordering_phone_number &&
    event.ordering_phone_number.value != fournisseur.ordering_phone_number
  ) {
    data["ordering_phone_number"] = event.ordering_phone_number.value;
  }
  if (
    event.accounting_phone_number &&
    event.accounting_phone_number.value != fournisseur.accounting_phone_number
  ) {
    data["accounting_phone_number"] = event.accounting_phone_number.value;
  }
  if (
    event.principal_email &&
    event.principal_email.value != fournisseur.principal_email
  ) {
    data["principal_email"] = event.principal_email.value;
  }
  if (
    event.ordering_email &&
    event.ordering_email.value != fournisseur.ordering_email
  ) {
    data["ordering_email"] = event.ordering_email.value;
  }
  if (
    event.cc_sales_email &&
    event.cc_sales_email.value != fournisseur.cc_sales_email
  ) {
    data["cc_sales_email"] = event.cc_sales_email.value;
  }

  return data;
}
