/**
 * Compile all the allergenes of the SousRecette in one string.
 *
 * @param {*} object object must hold an allergenes field that holds a list of Allergenes objects.
 * @returns the string compiling all the allergenes
 */
export default function get_allergene_string(object) {
  var allergene_string = "";
  if (object.allergenes.length > 0) {
    object.allergenes.forEach(
      (allergene) => (allergene_string += allergene.name + "; ")
    );
    allergene_string = allergene_string.substring(
      0,
      allergene_string.length - 2
    );
  }
  return allergene_string;
}
