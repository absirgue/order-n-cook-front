import { MONTHS } from "../../../../utils/general_constants";

export function get_initial_genre_select_value(recette) {
  return recette.genres.map((genre) => {
    return { value: genre, label: genre };
  });
}

export function get_initial_taste_select_value(recette) {
  return recette.tastes.map((taste) => {
    return { value: taste, label: taste };
  });
}

export function get_formatted_duration(recette) {
  var formatted_duration = recette.duration + "min.";
  if (recette.duration > 60) {
    formatted_duration =
      (recette.duration - (recette.duration % 60)) / 60 +
      "h. " +
      (recette.duration % 60) +
      "min.";
  }
  return formatted_duration;
}

export function get_taste_string(recette) {
  var tastes_string = "";
  if (recette.tastes.length > 0) {
    recette.tastes.forEach((taste) => (tastes_string += taste + "; "));
    tastes_string = tastes_string.substring(0, tastes_string.length - 2);
  }
  return tastes_string;
}

export function get_genre_string(recette) {
  var genres_string = "";
  if (recette.genres.length > 0) {
    recette.genres.forEach((genre) => (genres_string += genre + "; "));
    genres_string = genres_string.substring(0, genres_string.length - 2);
  }
  return genres_string;
}

export function get_recette_season_start_month(recette) {
  let recette_season_start = null;
  if (recette.season) {
    if (recette.season[0] && recette.season[recette.season.length - 1]) {
      for (let i = recette.season.length - 1; i >= 0; i = i - 1) {
        if (!recette.season[i]) {
          recette_season_start = MONTHS[i + 1];
          break;
        }
      }
    } else {
      for (let i = 0; i < recette.season.length; i++) {
        if (recette.season[i]) {
          recette_season_start = MONTHS[i];
          break;
        }
      }
    }
  }
  return recette_season_start;
}

export function get_recette_season_end_month(recette) {
  let recette_season_end = null;

  if (recette.season) {
    if (recette.season[0] && recette.season[recette.season.length - 1]) {
      for (let i = 0; i < recette.season.length; i++) {
        if (!recette.season[i]) {
          recette_season_end = MONTHS[i - 1];
          break;
        }
      }
    } else {
      for (let i = recette.season.length - 1; i >= 0; i = i - 1) {
        if (recette.season[i]) {
          recette_season_end = MONTHS[i];
          break;
        }
      }
    }
  }
  return recette_season_end;
}
