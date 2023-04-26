import { Table } from "reactstrap";
import SousRecetteListItem from "./sous_recette_list_item";
import AddSousRecette from "./edit_only/add_buttons/add_sous_recette";
const AllSousRecettesDisplay = ({ recette, is_edit = false }) => {
  return (
    <>
      {recette.sous_recette && recette.sous_recette.length > 0 ? (
        <div className="d-flex flex-column justify-content-start align-items-center col-12 mt-4">
          <h5>Sous Recettes</h5>
          <div className="col-12">
            <Table hover>
              <tbody>
                {recette.sous_recette.map((sous_recette) => (
                  <SousRecetteListItem
                    sous_recette={sous_recette}
                    key={sous_recette.id}
                    is_edit={is_edit}
                    recette_id={recette.id}
                  ></SousRecetteListItem>
                ))}
              </tbody>
            </Table>
            {is_edit ? (
              <AddSousRecette recette_id={recette.id}></AddSousRecette>
            ) : null}
          </div>
        </div>
      ) : is_edit ? (
        <div className="d-flex flex-column justify-content-start align-items-center col-12 mt-4">
          <h5>Sous Recettes</h5>
          <AddSousRecette recette_id={recette.id}></AddSousRecette>
        </div>
      ) : null}
    </>
  );
};

export default AllSousRecettesDisplay;
