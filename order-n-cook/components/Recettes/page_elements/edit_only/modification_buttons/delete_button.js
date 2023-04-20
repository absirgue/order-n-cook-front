import { Button } from "reactstrap";

const DeleteButton = ({
  is_progression = false,
  is_ingredient = false,
  is_sous_recette = false,
  element,
}) => {
  let delete_confirmation_text = "";
  if (is_progression) {
    delete_confirmation_text =
      "Êtes-vous sûr de vouloir supprimer cet élément de progression ?";
  } else if (is_sous_recette) {
    delete_confirmation_text =
      "Êtes-vous sûr de vouloir supprimer cette sous recette?";
  } else if (is_ingredient) {
    delete_confirmation_text =
      "Êtes-vous sûr de vouloir supprimer l'ingrédient \"" +
      element.name.toLowerCase() +
      '" de cette recette ?';
  }

  const deleteItem = () => {
    alert("Suppression " + element.name);
  };
  return (
    <Button
      className="emoji_button"
      title="Supprimer"
      onClick={() => {
        if (window.confirm(delete_confirmation_text)) deleteItem();
      }}
    >
      🗑
    </Button>
  );
};

export default DeleteButton;
