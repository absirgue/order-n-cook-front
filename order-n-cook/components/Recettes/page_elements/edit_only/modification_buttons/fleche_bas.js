import { Button } from "reactstrap";
import { useSWRConfig } from "swr";

const FlecheBasButton = ({ element, recette_id }) => {
  const { mutate } = useSWRConfig();
  const handleClick = async () => {
    let endpoint =
      "http://127.0.0.1:8000/api/decerement_progression_rank/" +
      element.id +
      "/";

    const options = {
      // The method is POST because we are sending data.
      method: "PUT",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);
    if (response.status == 200) {
      mutate(`http://127.0.0.1:8000/api/recettes/${recette_id}/`);
    } else {
      alert(
        "Opération impossible. Merci de vérifier sa validité et de réessayer plus tard."
      );
    }
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
