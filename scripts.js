countries = [];

const getDefaultDetails = () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("https://api.covid19api.com/summary", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const { TotalConfirmed } = data.Global;

      $(".card#who .count").text(Intl.NumberFormat().format(TotalConfirmed));

      this.countries = data.Countries;

      const defCountries = countries.filter(
        (dataC) => dataC.CountryCode === "US" || dataC.CountryCode === "TR"
      );

      defCountries.forEach((dataDC) => {
        const { TotalConfirmed, CountryCode } = dataDC;
        $(`.card#${CountryCode.toLowerCase()} .count`).text(
          Intl.NumberFormat().format(TotalConfirmed)
        );
      });
    });
};

searchTimeout = "";
const search = (q) => {
  clearTimeout(this.searchTimeout);

  $(".country-details").removeClass("active");
  $(".no-result").removeClass("active");

  if (q !== "") {
    $(".loader").addClass("active");
    this.searchTimeout = setTimeout(() => {
      if (
        !this.countries.some((data, index) => {
          if (
            data.CountryCode.toLowerCase() === q.toLowerCase() ||
            data.Country.toLowerCase().includes(q.toLowerCase())
          ) {
            getSearchedDetails(index);
            return true;
          }
          return false;
        })
      ) {
        $(".no-result").addClass("active");
        $(".loader").removeClass("active");
      }
    }, 1300);
  } else {
    $(".loader").removeClass("active");
  }
};

const getSearchedDetails = (index) => {
  const country = countries[index];
  fetch(
    `https://restcountries.com/rest/v2/alpha/${country.CountryCode}?fields=flag;population`
  )
    .then((response) => response.json())
    .then((data) => {
      country["details"] = data;

      setTimeout(() => {
        const {
          details,
          Country,
          NewConfirmed,
          NewDeaths,
          NewRecovered,
          TotalConfirmed,
          TotalDeaths,
          TotalRecovered,
        } = country;
        if (!$(".country-details").hasClass("active"))
          $(".country-details").addClass("active");
        $(".loader").removeClass("active");

        $(".country-details .country-name .country-cover").css(
          "background-image",
          `url("${details.flag}")`
        );
        $(".country-details .country-name .name").text(country.Country);

        $(".country-details .population span").text(
          Intl.NumberFormat().format(details.population)
        );

        $(".country-details #newCase .count").text(
          Intl.NumberFormat().format(NewConfirmed)
        );
        $(".country-details #newDeath .count").text(
          Intl.NumberFormat().format(NewDeaths)
        );
        $(".country-details #newRecovery .count").text(
          Intl.NumberFormat().format(NewRecovered)
        );
        $(".country-details #totalCase .count").text(
          Intl.NumberFormat().format(TotalConfirmed)
        );
        $(".country-details #totalDeath .count").text(
          Intl.NumberFormat().format(TotalDeaths)
        );
        $(".country-details #totalRecovery .count").text(
          Intl.NumberFormat().format(TotalRecovered)
        );

        const lastUpdateDate = moment(new Date(country.Date)).fromNow();
        $(".country-details .updated-at span").text(lastUpdateDate);
      }, 20);
    });
};
