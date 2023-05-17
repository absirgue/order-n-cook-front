import {
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
import get_allergene_string from "../helper_functions/allerge_string_maker";

const AllergenesPopover = ({ object }) => {
  return (
    <div className="d-flex flex-row justify-content-end">
      <Button color="white" type="button" id={"see-allergenes" + object.id}>
        ℹ️
      </Button>
      <UncontrolledPopover
        placement="bottom"
        target={"see-allergenes" + object.id}
        trigger="legacy"
      >
        <PopoverHeader>Allergènes</PopoverHeader>
        <PopoverBody>{get_allergene_string(object)}</PopoverBody>
      </UncontrolledPopover>
    </div>
  );
};

export default AllergenesPopover;
