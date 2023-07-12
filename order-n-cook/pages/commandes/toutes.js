import React, { useState } from "react";
import { Table } from "reactstrap";
import CommandeListItem from "../../components/Commandes/commande_list_item";
import {
  get_commande_status_color,
  DEFAULT_STATUS,
} from "../../components/Commandes/helpers";

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`http://127.0.0.1:8000/api/commandes/`);
  let allCommandesData = await res.json();
  allCommandesData = allCommandesData.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  return {
    props: { allCommandesData },
  };
}

// The initial data needs to be grouped and sorted in alphabetical order so that this alphabetical order is
// kept across the differents groupings realised by the user.
function get_initial_data_grouped_and_sorted(allCommandesData) {
  const grouped_default_data = allCommandesData.reduce((group, commande) => {
    const { month } = commande;
    group[month] = group[month] ?? [];
    group[month].push(commande);
    return group;
  }, {});
  var default_data = [];

  for (var key in grouped_default_data) {
    if (grouped_default_data.hasOwnProperty(key)) {
      default_data.push({
        group_name: key,
        commandes: grouped_default_data[key],
      });
    }
  }
  return default_data;
}

export default function AllCommandesData({ allCommandesData }) {
  const [groupedData, setGroupedData] = useState(
    get_initial_data_grouped_and_sorted(allCommandesData)
  );
  const [filteredData, setFilteredData] = useState(allCommandesData);
  const [groupingField, setGroupingField] = useState("default");
  const [filteringField, setFilteringField] = useState("all");
  const [filters, setFilters] = useState(create_filter());

  function create_filter() {
    const all_status = DEFAULT_STATUS.map((status) => {
      const itemExists = allCommandesData.find(
        (commande) => commande.status === status[0]
      );
      if (itemExists && itemExists.status_text) {
        return { status: itemExists.status, text: itemExists.status_text };
      } else {
        return { status: status[0], text: status[1] };
      }
    });
    return all_status;
  }

  function group_list_based_on_field(list, groupField) {
    return list.reduce((group, product) => {
      if (groupField == "month" || groupField == "default" || !groupField) {
        const { month } = product;
        group[month] = group[month] ?? [];
        group[month].push(product);
        return group;
      } else if (groupField) {
        if (groupField == "fournisseur") {
          const { fournisseur } = product;
          group[fournisseur.name] = group[fournisseur.name] ?? [];
          group[fournisseur.name].push(product);
          return group;
        }
      }
    }, {});
  }

  function filterCommandes(filter) {
    if (filter && filter != "all") {
      setFilteredData(
        allCommandesData.filter((commande) => commande.status == filter)
      );

      groupCommandesData(
        allCommandesData.filter((commande) => commande.status == filter),
        groupingField
      );
    } else {
      setFilteredData(allCommandesData);
      groupCommandesData(allCommandesData, groupingField);
    }
  }

  // Sort the groups alphabetically.
  function get_sorted_and_cleaned_groups_data(group_data) {
    var dict_to_array = [];

    for (var key in group_data) {
      if (group_data.hasOwnProperty(key)) {
        dict_to_array.push({ group_name: key, commandes: group_data[key] });
      }
    }
    return dict_to_array.sort(function (a, b) {
      if (a.group_name < b.group_name) {
        return -1;
      }
      if (a.group_name > b.group_name) {
        return 1;
      }
      return 0;
    });
  }

  // Helper to combine the two grouping operations
  const groupCommandesData = (dataToFilter, groupField) => {
    const groupedFournisseurs = group_list_based_on_field(
      dataToFilter,
      groupField
    );
    const sorted_and_cleaned_groups_data =
      get_sorted_and_cleaned_groups_data(groupedFournisseurs);
    setGroupedData(sorted_and_cleaned_groups_data);
  };

  return (
    <div className="col-12 col-lg-10">
      <div className={"d-flex flex-row m-1"}>
        <div
          className={
            "col-7 d-flex flex-row justify-content-between align-items-center flex-wrap"
          }
        >
          <select
            className={"btn"}
            onChange={(e) => {
              setFilteringField(e.target.value);
              filterCommandes(e.target.value);
            }}
            value={filteringField}
            style={{
              textAlign: "start",
              paddingTop: "12px",
              paddingBottom: "12px",
              backgroundColor: get_commande_status_color(filteringField),
              borderRadius: "15px",
            }}
          >
            <option value="all" selected>
              Toutes
            </option>
            {filters.map((filter) => {
              return <option value={filter.status}>{filter.text}</option>;
            })}
          </select>
        </div>
        <div className={"col-5 d-flex flex-row justify-content-end"}>
          <button
            className={"btn"}
            style={{ textDecorationLine: "underline", color: "#6C757D" }}
            onClick={() => {
              setGroupedData(
                get_initial_data_grouped_and_sorted(allCommandesData)
              );
              setFilteredData(allCommandesData);
              setFilteringField("all");
              setGroupingField("default");
            }}
          >
            Réinitialiser
          </button>
          <select
            className={"btn"}
            onChange={(e) => {
              setGroupingField(e.target.value);
              groupCommandesData(filteredData, e.target.value);
            }}
            value={groupingField}
          >
            <option disabled value="default">
              Trier
            </option>
            <option value="month">Par mois</option>
            <option value="fournisseur">Par fournisseur</option>
          </select>
        </div>
      </div>
      {groupedData.length > 0 ? (
        <div>
          {groupedData.map((group) => (
            <div>
              <p
                style={{
                  background: "#CDCCCD",
                  paddingLeft: "10px",
                  marginBottom: "10px",
                }}
              >
                {group.group_name}
              </p>
              <Table hover style={{ backgroundColor: "transparent" }}>
                <tbody>
                  {group.commandes.map((commande) => (
                    <CommandeListItem commande={commande}></CommandeListItem>
                  ))}
                </tbody>
              </Table>
            </div>
          ))}
        </div>
      ) : (
        <div className={"d-flex flex-row justify-content-center"}>
          <p>
            Vous n'avez encore passé aucune commande. Si ce n'est pas le cas,
            merci de vérifier votre connexion internet puis de contacter le
            service technique.
          </p>
        </div>
      )}
    </div>
  );
}
