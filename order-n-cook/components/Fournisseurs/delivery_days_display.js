export default function DeliveryDaysDisplay({ fournisseurData }) {
  return (
    <>
      <p>
        <span
          className="p-1"
          style={{ marginBottom: "0px", fontStyle: "italic" }}
        >
          Jours de livraison:
        </span>
        <span
          className={
            fournisseurData.delivers_monday
              ? "green-label p-1"
              : "greyed-label p-1"
          }
          title={
            (fournisseurData.delivers_monday ? "Livre le" : "Ne livre pas le") +
            " lundi"
          }
        >
          Lundi
        </span>
        <span
          className={
            fournisseurData.delivers_tuesday
              ? "green-label p-1"
              : "greyed-label p-1"
          }
          title={
            (fournisseurData.delivers_tuesday
              ? "Livre le"
              : "Ne livre pas le") + " mardi"
          }
        >
          Mardi
        </span>
        <span
          className={
            fournisseurData.delivers_wednesday
              ? "green-label p-1"
              : "greyed-label p-1"
          }
          title={
            (fournisseurData.delivers_wednesday
              ? "Livre le"
              : "Ne livre pas le") + " mercredi"
          }
        >
          Mercredi
        </span>
        <span
          className={
            fournisseurData.delivers_thursday
              ? "green-label p-1"
              : "greyed-label p-1"
          }
          title={
            (fournisseurData.delivers_thursday
              ? "Livre le"
              : "Ne livre pas le") + " jeudi"
          }
        >
          Jeudi
        </span>
        <span
          className={
            fournisseurData.delivers_friday
              ? "green-label p-1"
              : "greyed-label p-1"
          }
          title={
            (fournisseurData.delivers_friday ? "Livre le" : "Ne livre pas le") +
            " mercredi"
          }
        >
          Vendredi
        </span>
        <span
          className={
            fournisseurData.delivers_saturday
              ? "green-label p-1"
              : "greyed-label p-1"
          }
          title={
            (fournisseurData.delivers_saturday
              ? "Livre le"
              : "Ne livre pas le") + " samedi"
          }
        >
          Samedi
        </span>
        <span
          className={
            fournisseurData.delivers_sunday
              ? "green-label p-1"
              : "greyed-label p-1"
          }
          title={
            (fournisseurData.delivers_sunday ? "Livre le" : "Ne livre pas le") +
            " dimanche"
          }
        >
          Dimanche
        </span>
      </p>
    </>
  );
}
