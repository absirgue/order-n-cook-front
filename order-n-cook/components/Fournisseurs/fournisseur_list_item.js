import React from "react";
import Link from "next/link";
/*
 Component to display details about a single fournisseur as part of a list of fournisseurs. 
*/
const FournisseurListItem = ({ fournisseur }) => {
  return (
    <tr>
      <td
        className={"w-50"}
        style={{ verticalAlign: "middle", backgroundColor: "transparent" }}
      >
        <Link href={"/fournisseurs/" + fournisseur.id}>{fournisseur.name}</Link>
      </td>
      <td className={"w-25"} style={{ backgroundColor: "transparent" }}>
        <p style={{ marginBottom: "0px" }}>{fournisseur.category}</p>
      </td>
    </tr>
  );
};

export default FournisseurListItem;
