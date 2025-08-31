import pool from '../config/database';
import { Request, Response } from 'express';


export const createReport = async (req: Request, res: Response) => {
  try {
    const { title, description, category, urgency, locationData, photos, userId } = req.body;

    if (!title || !description || !category || !urgency || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      `INSERT INTO reports (title, description, category, urgency, locationData, photos, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, category, urgency, locationData, photos, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: "Failed to create report" });
  }
};


// Get all reports
export const getReport = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM reports ORDER BY timestamp DESC");
    res.status(200).json({ success: true, reports: result.rows });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

// Get report by ID
export const getReportById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM reports WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.status(200).json({ success: true, report: result.rows[0] });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ error: "Failed to fetch report" });
  }
};
