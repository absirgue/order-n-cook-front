import { Button } from "reactstrap";
const FlecheBasButton = ({ element }) => {
  const handleClick = () => {
    // et décaler tous les autres
    alert("rank: " + element.rank + "new rank: " + (element.rank + 1));
  };
  return (
    <Button
      className="emoji_button"
      title="Déplacer d'un rang au dessus"
      onClick={() => handleClick()}
    >
      ⬇️
    </Button>
  );
};

export default FlecheBasButton;
