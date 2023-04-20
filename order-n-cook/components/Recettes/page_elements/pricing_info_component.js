const PricingInformationComponent = ({
  title,
  value,
  is_tva = false,
  is_total_price = false,
  is_coefficient = false,
}) => {
  return (
    <div className="col-2 d-flex flex-column align-items-center m-1">
      <p className="mb-2" style={{ color: "grey", textAlign: "center" }}>
        {title}
      </p>
      <p style={{ fontSize: "17px" }}>
        {is_tva ? value + "%" : is_coefficient ? value : value + "€"}
      </p>
    </div>
  );
};

export default PricingInformationComponent;
