import { Table } from "reactstrap";
import SousRecetteListItem from "./list_items/sous_recette_list_item";
import AddSousRecette from "./edit_only/add_buttons/add_sous_recette";

/**
 * General display to show all SousRecette items both in edit and normal modes.
 * @param recette the Recette object on display
 * @param is_edit true if in edit mode, defaults to normal mode
 */
const AllSousRecettesDisplay = ({ recette, is_edit = false }) => {
  return (
    <>
      {recette.sous_recette && recette.sous_recette.length > 0 ? (
        <div className="d-flex flex-column justify-content-start align-items-center col-12 mt-4">
          <p
            className="col-12"
            style={{
              background: "#CDCCCD",
              paddingLeft: "10px",
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "500",
            }}
          >
            Sous Recettes
          </p>
          <div className="col-12">
            <Table hover style={{ backgroundColor: "transparent" }}>
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
