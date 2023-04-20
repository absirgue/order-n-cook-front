import React, { useState } from "react";

/*
 Component to display details about an ingredient's sasonnality. Months are displayed as individual circles
 and each is color coded depending on the situation.
*/
const SeasonnalityDisplay = ({ ingredient_data }) => {
  return (
    <div className={"d-flex flex-row justify-content-between"}>
      {get_season_symbol_list(ingredient_data).map((month_data) => {
        if (month_data.status == 1) {
          return (
            <div
              className="this-season-month-circle d-flex flex-column justify-content-center"
              title="Mois de saison"
            >
              {month_data.month}
            </div>
          );
        } else if (month_data.status == 2) {
          return (
            <div
              className="season-month-circle d-flex flex-column justify-content-center"
              title="De saison ce mois"
            >
              {month_data.month}
            </div>
          );
        } else if (month_data.status == 3) {
          return (
            <div
              className="this-not-season-month-circle d-flex flex-column justify-content-center"
              title="Hors saison ce mois"
            >
              {month_data.month}
            </div>
          );
        } else {
          return (
            <div
              className="not-season-month-circle d-flex flex-column justify-content-center"
              title="Mois hors saison"
            >
              {month_data.month}
            </div>
          );
        }
      })}
    </div>
  );
};

// Statuses encode which symbol is to be used for each month.
// If status is 1: the month is in season and is the current month.
// If status is 2: the month is in season but not this month.
// If status is 3: the month is not in season and is this month.
// If status is 4: the month is not in season and is not the current month.
const get_season_symbol_list = (ingredient_data) => {
  const abbreviated_months_of_year = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Juil",
    "Aout",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];
  const dateHelper = new Date();
  const current_month_number = dateHelper.getMonth();
  var season_symbols_data = [];
  for (let i = 0; i < abbreviated_months_of_year.length; i++) {
    if (ingredient_data.season[i]) {
      var status;
      if (i == current_month_number) {
        status = 1;
      } else {
        status = 2;
      }
    } else {
      if (i == current_month_number) {
        status = 3;
      } else {
        status = 4;
      }
    }
    season_symbols_data.push({
      month: abbreviated_months_of_year[i],
      status: status,
    });
  }
  return season_symbols_data;
};

export default SeasonnalityDisplay;
