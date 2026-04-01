import "dotenv/config";
import { supabase } from "./supabaseClient.js";

const fetchWeatherData = async () => {
  try {
    const key = process.env.weather_api_key;

    if (!key) throw new Error("Chave da API não encontrada");

    const result = await fetch(`${process.env.weather_api_url}&key=${key}`)
      .then((res) => res.json())
      .then((data) => {
        const {
          location: { name, region, country },
          current: {
            temp_c,
            temp_f,
            condition,
            feelslike_c,
            feelslike_f,
            last_updated,
          },
        } = data;
        return {
          name,
          region,
          country,
          temp_c,
          temp_f,
          condition,
          feelslike_c,
          feelslike_f,
          last_updated,
        };
      });

    return result;
  } catch (error) {
    console.log("Erro ao buscar dados da API de clima", error);
    return null;
  }
};

const fetchDollarData = async () => {
  try {
    const key = process.env.dollar_api_key;

    if (!key) throw new Error("Chave da API não encontrada");

    const result = await fetch(`${process.env.dollar_api_url}&key=${key}`)
      .then((res) => res.json())
      .then((data) => {
        const {
          rates: { BRL },
          valid,
          updated,
          base,
        } = data;
        return { conversion: BRL, valid, updated, base };
      });

    return result;
  } catch (error) {
    console.log("Erro ao buscar dados da API de dólar", error);
    return null;
  }
};

const main = async () => {
  const weatherData = await fetchWeatherData();
  const dollarData = await fetchDollarData();

  const { error } = await supabase.from("weatherdollarapi").insert({
    weather: weatherData,
    dollar: dollarData,
  });

  if (error) {
    console.error("Error inserting data:", error);
    return;
  }

  console.log("Data inserted successfully");
};

main();
