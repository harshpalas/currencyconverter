
  const countryList = {
    AED: "AE", AFN: "AF", XCD: "AG", ALL: "AL", AMD: "AM", ANG: "AN", AOA: "AO",
    AQD: "AQ", ARS: "AR", AUD: "AU", AWG: "AW", AZN: "AZ", BAM: "BA", BBD: "BB",
    BDT: "BD", XOF: "BE", BGN: "BG", BHD: "BH", BIF: "BI", BMD: "BM", BND: "BN",
    BOB: "BO", BRL: "BR", BSD: "BS", NOK: "BV", BWP: "BW", BYR: "BY", BZD: "BZ",
    CAD: "CA", CDF: "CD", XAF: "CF", CHF: "CH", CLP: "CL", CNY: "CN", COP: "CO",
    CRC: "CR", CUP: "CU", CVE: "CV", CYP: "CY", CZK: "CZ", DJF: "DJ", DKK: "DK",
    DOP: "DO", DZD: "DZ", ECS: "EC", EEK: "EE", EGP: "EG", ETB: "ET", EUR: "FR",
    FJD: "FJ", FKP: "FK", GBP: "GB", GEL: "GE", GGP: "GG", GHS: "GH", GIP: "GI",
    GMD: "GM", GNF: "GN", GTQ: "GT", GYD: "GY", HKD: "HK", HNL: "HN", HRK: "HR",
    HTG: "HT", HUF: "HU", IDR: "ID", ILS: "IL", INR: "IN", IQD: "IQ", IRR: "IR",
    ISK: "IS", JMD: "JM", JOD: "JO", JPY: "JP", KES: "KE", KGS: "KG", KHR: "KH",
    KMF: "KM", KPW: "KP", KRW: "KR", KWD: "KW", KYD: "KY", KZT: "KZ", LAK: "LA",
    LBP: "LB", LKR: "LK", LRD: "LR", LSL: "LS", LTL: "LT", LVL: "LV", LYD: "LY",
    MAD: "MA", MDL: "MD", MGA: "MG", MKD: "MK", MMK: "MM", MNT: "MN", MOP: "MO",
    MRO: "MR", MTL: "MT", MUR: "MU", MVR: "MV", MWK: "MW", MXN: "MX", MYR: "MY",
    MZN: "MZ", NAD: "NA", XPF: "NC", NGN: "NG", NIO: "NI", NPR: "NP", NZD: "NZ",
    OMR: "OM", PAB: "PA", PEN: "PE", PGK: "PG", PHP: "PH", PKR: "PK", PLN: "PL",
    PYG: "PY", QAR: "QA", RON: "RO", RSD: "RS", RUB: "RU", RWF: "RW", SAR: "SA",
    SBD: "SB", SCR: "SC", SDG: "SD", SEK: "SE", SGD: "SG", SKK: "SK", SLL: "SL",
    SOS: "SO", SRD: "SR", STD: "ST", SVC: "SV", SYP: "SY", SZL: "SZ", THB: "TH",
    TJS: "TJ", TMT: "TM", TND: "TN", TOP: "TO", TRY: "TR", TTD: "TT", TVD: "TV",
    TWD: "TW", TZS: "TZ", UAH: "UA", UGX: "UG", USD: "US", UYU: "UY", UZS: "UZ",
    VEF: "VE", VND: "VN", VUV: "VU", YER: "YE", ZAR: "ZA", ZMK: "ZM", ZWD: "ZW",
  };

  const popularCurrencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR", "KRW"];
  const currencies = Object.keys(countryList).sort();

  const fromSelect = document.getElementById("fromCurrency");
  const toSelect = document.getElementById("toCurrency");
  const amountInput = document.getElementById("amount");
  const convertBtn = document.getElementById("convertBtn");
  const resultDiv = document.getElementById("result");
  const errorDiv = document.getElementById("error");

  function getFlagUrl(currencyCode) {
    const countryCode = countryList[currencyCode];
    return countryCode ? `https://flagsapi.com/${countryCode}/flat/64.png` : "";
  }

  // Build options with flags
  function buildOptions(selectElement) {
    // Clear existing options
    selectElement.innerHTML = "";

    // Popular currencies group label
    const popularGroup = document.createElement("optgroup");
    popularGroup.label = "Popular";
    popularCurrencies.forEach((currency) => {
      const option = document.createElement("option");
      option.value = currency;
      option.text = currency;
      popularGroup.appendChild(option);
    });
    selectElement.appendChild(popularGroup);

    // All other currencies group label
    const allGroup = document.createElement("optgroup");
    allGroup.label = "All Currencies";

    currencies
      .filter((cur) => !popularCurrencies.includes(cur))
      .forEach((currency) => {
        const option = document.createElement("option");
        option.value = currency;
        option.text = currency;
        allGroup.appendChild(option);
      });
    selectElement.appendChild(allGroup);
  }

  // Show flag next to selected option label
  function updateFlag(selectElement, imgElement) {
    const currencyCode = selectElement.value;
    const flagUrl = getFlagUrl(currencyCode);
    if (flagUrl) {
      imgElement.src = flagUrl;
      imgElement.alt = currencyCode;
    } else {
      imgElement.src = "";
      imgElement.alt = "";
    }
  }

  // Initialize selects
  buildOptions(fromSelect);
  buildOptions(toSelect);

  // Default flags images
  const fromFlag = document.createElement("img");
  fromFlag.className = "flag";
  fromSelect.parentNode.insertBefore(fromFlag, fromSelect);

  const toFlag = document.createElement("img");
  toFlag.className = "flag";
  toSelect.parentNode.insertBefore(toFlag, toSelect);

  // Update flags initially
  updateFlag(fromSelect, fromFlag);
  updateFlag(toSelect, toFlag);

  fromSelect.addEventListener("change", () => updateFlag(fromSelect, fromFlag));
  toSelect.addEventListener("change", () => updateFlag(toSelect, toFlag));

  convertBtn.addEventListener("click", async () => {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
      errorDiv.textContent = "Please enter a valid amount greater than zero.";
      resultDiv.textContent = "";
      return;
    }

    errorDiv.textContent = "";
    resultDiv.textContent = "Loading...";

    const from = fromSelect.value;
    const to = toSelect.value;

    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
      if (!res.ok) throw new Error("Failed to fetch exchange rate");
      const data = await res.json();

      if (!data.rates || !data.rates[to]) {
        throw new Error("Currency not supported");
      }

      const rate = data.rates[to];
      const converted = amount * rate;

      resultDiv.textContent = `${amount.toFixed(2)} ${from} = ${converted.toFixed(2)} ${to} (1 ${from} = ${rate.toFixed(4)} ${to})`;
    } catch (e) {
      errorDiv.textContent = "Error fetching exchange rate. Try again later.";
      resultDiv.textContent = "";
      console.error(e);
    }
  });
