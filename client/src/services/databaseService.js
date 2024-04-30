// services/databaseService.js
import { createClient } from "@libsql/client";
const client = createClient({
  url: "libsql://webapptest-sasax7.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTQyOTM0MzYsImlkIjoiM2ZiNjJiZTYtYzU4Mi00YzM3LWFhOTctYzdkYzkzYzk3NmRjIn0.1Zn545j3bRleR3TVa2ntRE1GZnHUSHRDCL_h3j8ULZBH_Tj8SWgeT5I4aVElLPVjOYWuCTjtkOQd8f2oE4qYAA",
});

export async function executeQuery(sql, args = []) {
  try {
    const result = await client.execute({ sql, args });
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}
export async function insertIntoDatabase(data) {
  const insertQuery = `
    INSERT INTO candlesticks (timeframe, pair_id, time, open, high, low, close, volume)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const record of data) {
    const {
      "DateTime Stamp": date_time,
      "Bar OPEN Bid Quote": open_price,
      "Bar HIGH Bid Quote": high_price,
      "Bar LOW Bid Quote": low_price,
      "Bar CLOSE Bid Quote": close_price,
      Volume: volume,
    } = record;
    await executeQuery(insertQuery, [
      1,
      1,
      date_time,
      open_price,
      high_price,
      low_price,
      close_price,
      volume,
    ]);
  }
}

export async function readCsvFile(filePath) {
  const response = await fetch(filePath);
  const fileContent = await response.text();

  const lines = fileContent.split("\n");

  const records = lines.map((line) => {
    const [dateTime, open, high, low, close, volume] = line.split(";");

    console.log("dateTime", dateTime);
    // Convert the dateTime into Unix time
    const unixTime =
      Date.parse(
        dateTime.slice(0, 4) +
          "-" +
          dateTime.slice(4, 6) +
          "-" +
          dateTime.slice(6, 8) +
          "T" +
          dateTime.slice(9, 11) +
          ":" +
          dateTime.slice(11, 13) +
          ":" +
          dateTime.slice(13, 15)
      ) / 1000;

    return {
      "DateTime Stamp": unixTime,
      "Bar OPEN Bid Quote": parseFloat(open),
      "Bar HIGH Bid Quote": parseFloat(high),
      "Bar LOW Bid Quote": parseFloat(low),
      "Bar CLOSE Bid Quote": parseFloat(close),
      Volume: parseInt(volume, 10),
    };
  });

  console.log("records", records);

  return records;
}

export async function fetchCandlestickData() {
  try {
    const result = await client.execute("SELECT * FROM candlesticks"); // Adjust SQL query as needed
    console.log("Candlestick data:", result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error fetching candlestick data:", error);
    throw error;
  }
}

export async function registerUser(username, email, password) {
  try {
    const sql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const result = await executeQuery(sql, [username, email, password]);
    console.log("User registered", result);
    return result;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}
/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{id: string}>}
 */
export async function loginUser(username, password) {
  try {
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    const result = await executeQuery(sql, [username, password]);
    if (result.rows.length > 0) {
      console.log("User logged in", result.rows[0]);
      return { id: result.rows[0].id }; // Return the user ID
    } else {
      throw new Error("Invalid username or password");
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

/**
 * @param {string} userId
 * @returns {Promise<{name: string}>}
 */
export async function getUserInfo(userId) {
  try {
    const sql = "SELECT username FROM users WHERE id = ?";
    const result = await executeQuery(sql, [userId]);
    if (result.rows.length > 0) {
      console.log("User info:", result.rows[0]);
      return { name: result.rows[0].username }; // Return the user name
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error getting user info:", error);
    throw error;
  }
}

/**
 * @param {string} strategyName
 * @param {string} userId
 * @returns {Promise<{id: string}>}
 */
export async function addStrategy(strategyName, userId) {
  try {
    const sql = "INSERT INTO strategies (name) VALUES (?)";
    const result = await executeQuery(sql, [strategyName]);
    console.log("Strategy added:", result);

    const strategyId = Number(result.lastInsertRowid);

    const linkSql =
      "INSERT INTO userstrategies (user_id, strategy_id) VALUES (?, ?)";
    await executeQuery(linkSql, [Number(userId), strategyId]); // Convert userId to a number
    console.log("User and strategy linked");

    // Automatically add a default stop loss name
    await addStopLossName("default stoploss", strategyId);
    console.log("Default stop loss name added");

    return { id: strategyId }; // Return the strategy ID
  } catch (error) {
    console.error("Error adding strategy:", error);
    throw error;
  }
}

/**
 * @param {string} userId
 * @returns {Promise<Array<{id: string, name: string}>>}
 */
export async function getStrategies(userId) {
  try {
    const sql = `
      SELECT strategies.id, strategies.name
      FROM strategies
      INNER JOIN userstrategies ON strategies.id = userstrategies.strategy_id
      WHERE userstrategies.user_id = ?
    `;
    const result = await executeQuery(sql, [userId]);
    console.log("Strategies:", result.rows);
    return result.rows; // Return the strategies
  } catch (error) {
    console.error("Error getting strategies:", error);
    throw error;
  }
}

/**
 * @param {string} stopLossName
 * @param {string} strategyId
 * @returns {Promise<{id: string}>}
 */
export async function addStopLossName(stopLossName, strategyId) {
  try {
    // Insert the stop loss name into the stoplossesname table
    const sql = "INSERT INTO stoplossesname (name) VALUES (?)";
    const result = await executeQuery(sql, [stopLossName]);
    console.log("Stop loss name added:", result);

    const stopLossNameId = Number(result.lastInsertRowid);

    // Link the stop loss name to the strategy in the strategystoplosses table
    const linkSql =
      "INSERT INTO strategystoplosses (strategy_id, stoploss_id) VALUES (?, ?)";
    await executeQuery(linkSql, [Number(strategyId), stopLossNameId]); // Convert strategyId to a number
    console.log("Strategy and stop loss name linked");

    return { id: stopLossNameId }; // Return the stop loss name ID
  } catch (error) {
    console.error("Error adding stop loss name:", error);
    throw error;
  }
}

/**
 * @param {string} strategyId
 * @returns {Promise<Array<{id: string, name: string}>>}
 */
export async function getStopLossNames(strategyId) {
  try {
    const sql = `
      SELECT stoplossesname.id, stoplossesname.name
      FROM stoplossesname
      INNER JOIN strategystoplosses ON stoplossesname.id = strategystoplosses.stoploss_id
      WHERE strategystoplosses.strategy_id = ?
    `;
    const result = await executeQuery(sql, [strategyId]);
    console.log("Stop loss names:", result.rows);
    return result.rows; // Return the stop loss names
  } catch (error) {
    console.error("Error getting stop loss names:", error);
    throw error;
  }
}

/**
 * @param {string} takeProfitName
 * @param {string} strategyId
 * @returns {Promise<{id: string}>}
 */
export async function addTakeProfitName(takeProfitName, strategyId) {
  try {
    // Insert the take profit name into the takeprofitname table
    const sql = "INSERT INTO takeprofitname (name) VALUES (?)";
    const result = await executeQuery(sql, [takeProfitName]);
    console.log("Take profit name added:", result);

    const takeProfitNameId = Number(result.lastInsertRowid);

    // Link the take profit name to the strategy in the strategytakeprofits table
    const linkSql =
      "INSERT INTO strategytakeprofit (strategy_id, takeprofit_id) VALUES (?, ?)";
    await executeQuery(linkSql, [Number(strategyId), takeProfitNameId]); // Convert strategyId to a number
    console.log("Strategy and take profit name linked");

    return { id: takeProfitNameId }; // Return the take profit name ID
  } catch (error) {
    console.error("Error adding take profit name:", error);
    throw error;
  }
}

/**
 * @param {string} strategyId
 * @returns {Promise<Array<{id: string, name: string}>>}
 */
export async function getTakeProfitNames(strategyId) {
  try {
    const sql = `
      SELECT takeprofitname.id, takeprofitname.name
      FROM takeprofitname
      INNER JOIN strategytakeprofit ON takeprofitname.id = strategytakeprofit.takeprofit_id
      WHERE strategytakeprofit.strategy_id = ?
    `;
    const result = await executeQuery(sql, [strategyId]);
    console.log("Take profit names:", result.rows);
    return result.rows; // Return the take profit names
  } catch (error) {
    console.error("Error getting take profit names:", error);
    throw error;
  }
}
/**
 * @param {string} indicatorName
 * @param {string} strategyId
 * @returns {Promise<{id: string}>}
 */
export async function addIndicatorName(indicatorName, strategyId) {
  try {
    // Insert the indicator name into the indicatorname table
    const sql = "INSERT INTO indicatorname (name) VALUES (?)";
    const result = await executeQuery(sql, [indicatorName]);
    console.log("Indicator name added:", result);

    const indicatorNameId = Number(result.lastInsertRowid);

    // Link the indicator name to the strategy in the strategyindicators table
    const linkSql =
      "INSERT INTO strategyindicator (strategy_id, indicator_id) VALUES (?, ?)";
    await executeQuery(linkSql, [Number(strategyId), indicatorNameId]); // Convert strategyId to a number
    console.log("Strategy and indicator name linked");

    return { id: indicatorNameId }; // Return the indicator name ID
  } catch (error) {
    console.error("Error adding indicator name:", error);
    throw error;
  }
}

/**
 * @param {string} strategyId
 * @returns {Promise<Array<{id: string, name: string}>>}
 */
export async function getIndicatorNames(strategyId) {
  try {
    const sql = `
      SELECT indicatorname.id, indicatorname.name
      FROM indicatorname
      INNER JOIN strategyindicator ON indicatorname.id = strategyindicator.indicator_id
      WHERE strategyindicator.strategy_id = ?
    `;
    const result = await executeQuery(sql, [strategyId]);
    console.log("Indicator names:", result.rows);
    return result.rows; // Return the indicator names
  } catch (error) {
    console.error("Error getting indicator names:", error);
    throw error;
  }
}
/**
 * @param {string} pricePointName
 * @param {string} strategyId
 * @returns {Promise<{id: string}>}
 */
export async function addPricePointName(pricePointName, strategyId) {
  try {
    // Insert the price point name into the pricepointname table
    const sql = "INSERT INTO pricepointname (name) VALUES (?)";
    const result = await executeQuery(sql, [pricePointName]);
    console.log("Price point name added:", result);

    const pricePointNameId = Number(result.lastInsertRowid);

    // Link the price point name to the strategy in the strategypricepoints table
    const linkSql =
      "INSERT INTO strategypricepoint (strategy_id, pricepoint_id) VALUES (?, ?)";
    await executeQuery(linkSql, [Number(strategyId), pricePointNameId]); // Convert strategyId to a number
    console.log("Strategy and price point name linked");

    return { id: pricePointNameId }; // Return the price point name ID
  } catch (error) {
    console.error("Error adding price point name:", error);
    throw error;
  }
}

/**
 * @param {string} strategyId
 * @returns {Promise<Array<{id: string, name: string}>>}
 */
export async function getPricePointNames(strategyId) {
  try {
    const sql = `
      SELECT pricepointname.id, pricepointname.name
      FROM pricepointname
      INNER JOIN strategypricepoint ON pricepointname.id = strategypricepoint.pricepoint_id
      WHERE strategypricepoint.strategy_id = ?
    `;
    const result = await executeQuery(sql, [strategyId]);
    console.log("Price point names:", result.rows);
    return result.rows; // Return the price point names
  } catch (error) {
    console.error("Error getting price point names:", error);
    throw error;
  }
}

export async function addAdvancedTrade(
  strategyId,
  pairId,
  dateStart,
  entryPrice,
  stopLossPrice
) {
  try {
    // Determine the trade type
    const tradeType = entryPrice >= stopLossPrice ? true : false;

    let triggerSql; // Declare triggerSql outside the if-else block

    if (tradeType) {
      triggerSql =
        "SELECT MIN(time) AS mintime FROM candlesticks WHERE pair_id = ? AND time > ? AND timeframe = 1.0 AND low < ? ";
    } else {
      triggerSql =
        "SELECT MIN(time) AS mintime FROM candlesticks WHERE pair_id = ? AND time > ? AND timeframe = 1.0 AND high > ? ";
    }
    const triggeredDaterows = await executeQuery(triggerSql, [
      pairId,
      dateStart,
      entryPrice,
    ]);
    if (triggeredDaterows.rows.length === 0) {
      throw new Error("Trade not triggered");
    }
    // Now you can access the value directly using the alias
    const triggeredDate = triggeredDaterows.rows[0].mintime;
    console.log("mintime", triggeredDate);
    // Insert the advanced trade
    const tradeSql =
      "INSERT INTO advancedtrade (strategy_id, pair_id, start_date, entry_price, is_buy, triggered_date) VALUES (?, ?, ?, ?, ?, ?)";
    const trade = await executeQuery(tradeSql, [
      strategyId,
      pairId,
      dateStart,
      entryPrice,
      tradeType,
      triggeredDate,
    ]);
    console.log("Advanced trade added:", trade);

    // Get the ID of the newly inserted advanced trade
    const advancedTradeId = trade.lastInsertRowid;

    // Get the ID of the default stop loss name
    const stopLossNames = await getStopLossNames(strategyId);
    const defaultStopLossName = stopLossNames.find(
      (name) => name.name === "default stoploss"
    );
    if (!defaultStopLossName) {
      throw new Error("Default stop loss name not found");
    }
    const stopLossNameId = defaultStopLossName.id;

    let stopLossTriggerSql; // Declare stopLossTriggerSql outside the if-else block

    if (tradeType) {
      stopLossTriggerSql =
        "SELECT MIN(time) AS mintime FROM candlesticks WHERE pair_id = ? AND time > ? AND timeframe = 1.0 AND low >= ? ";
    } else {
      stopLossTriggerSql =
        "SELECT MIN(time) AS mintime FROM candlesticks WHERE pair_id = ? AND time > ? AND timeframe = 1.0 AND high <= ? ";
    }
    const stopLossTriggeredDaterows = await executeQuery(stopLossTriggerSql, [
      pairId,
      triggeredDate,
      stopLossPrice,
    ]);

    if (stopLossTriggeredDaterows.rows.length === 0) {
      throw new Error("Stop loss not triggered");
    }
    // Now you can access the value directly using the alias
    const stopLossTriggeredDate = stopLossTriggeredDaterows.rows[0].mintime;

    let stopLosshighestPriceSql; // Declare stopLosshighestPriceSql outside the if-else block
    if (tradeType) {
      stopLosshighestPriceSql =
        "SELECT MAX(high) AS hprice FROM candlesticks WHERE pair_id = ? AND time >= ? AND time <= ? AND timeframe = 1.0";
    } else {
      stopLosshighestPriceSql =
        "SELECT MIN(low) AS hprice FROM candlesticks WHERE pair_id = ? AND time >= ? AND time <= ? AND timeframe = 1.0";
    }
    const stopLosshighestPriceRows = await executeQuery(
      stopLosshighestPriceSql,
      [pairId, triggeredDate, stopLossTriggeredDate]
    );
    if (stopLosshighestPriceRows.rows.length === 0) {
      throw new Error("Highest price not found");
    }
    // Now you can access the value directly using the alias
    const highestPrice = stopLosshighestPriceRows.rows[0].hprice;

    const risk = Math.abs(entryPrice - stopLossPrice);
    const reward = Math.abs(highestPrice - entryPrice);

    // Calculate risk-reward ratio
    let highestriskRewardRatio;
    if (risk !== 0) {
      // Prevent division by zero
      highestriskRewardRatio = reward / risk;
    } else {
      throw new Error("Risk is zero, cannot calculate risk-reward ratio.");
    }
    const hit1RR = highestriskRewardRatio >= 1 ? true : false;
    // Insert the default stop loss
    const stopLossSql =
      "INSERT INTO StopLoss (price, trade_id, stoploss_name_id, timehit, highest_price, highest_RR, hit_1_RR) VALUES (?, ?, ?, ? , ?, ?, ?)";
    await executeQuery(stopLossSql, [
      stopLossPrice,
      advancedTradeId,
      stopLossNameId,
      stopLossTriggeredDate,
      highestPrice,
      highestriskRewardRatio,
      hit1RR,
    ]);
    console.log("Default stop loss added");

    return trade;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
