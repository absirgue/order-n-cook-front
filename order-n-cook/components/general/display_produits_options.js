export default function ProduitOptionDisplay({ produits }) {
  return produits.map((produit) => (
    <div
      className="d-flex flex-row justify-content-start align-items-center"
      style={{ overflow: "scroll" }}
    >
      <Button
        className="emoji_button"
        onClick={() => {
          setProductIsSelected(true);
          setSelectedProduct({
            ...produit,
            ingredient: { name: ingredient.name },
          });
        }}
      >
        🛒
      </Button>

      <p className="col-3" style={{ textAlign: "center" }}>
        {produit.fournisseur_name}
      </p>
      <p className="col-3 me-2">
        {produit.real_unit.quantity + " " + produit.real_unit.unit}
        {produit.conversion_unit
          ? " (" +
            produit.conversion_unit.quantity +
            produit.conversion_unit.unit +
            ")"
          : null}
      </p>
      <p className="col-1 align-items-end">{produit.price + "€"}</p>
      <p className="col-1 align-items-end">
        {produit.kilogramme_price + "€/kg"}
      </p>
      {produit.labels && produit.labels.length > 0 ? (
        <div className="d-flex flex-row justify-content-end">
          <Button
            color="white"
            type="button"
            id="see-labels"
            style={{ textDecoration: "underline", color: "blue" }}
          >
            Labels
          </Button>
          <UncontrolledPopover
            placement="bottom"
            target="see-labels"
            trigger="legacy"
          >
            <PopoverHeader>Labels</PopoverHeader>
            <PopoverBody>
              {produit.labels.reduce(
                (accumulator, currentValue) =>
                  accumulator + currentValue.name + " ",
                ""
              )}
            </PopoverBody>
          </UncontrolledPopover>
        </div>
      ) : null}
      {produit.geographic_location ? (
        <div className="d-flex flex-row justify-content-end">
          <Button
            color="white"
            type="button"
            id="see-labels"
            style={{ textDecoration: "underline", color: "blue" }}
          >
            Provenance
          </Button>
          <UncontrolledPopover
            placement="bottom"
            target="see-labels"
            trigger="legacy"
          >
            <PopoverHeader>Labels</PopoverHeader>
            <PopoverBody>{produit.geographic_location}</PopoverBody>
          </UncontrolledPopover>
        </div>
      ) : null}
    </div>
  ));
}
