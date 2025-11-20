import Logs from "../models/logs-model.js";

export const createLog = async (logData) => {
  try {
    const newLog = new Logs(logData);
    await newLog.save();
    return newLog;
  } catch (error) {
    throw new Error("Error creating log");
  }
};
export const getLogs = async (req, res) => {
  try {
    const logs = await Logs.find().populate('user_id', 'firstname lastname email role');
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs" });
  }
};  