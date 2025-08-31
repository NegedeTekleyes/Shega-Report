import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Create a new compliance report
export const createReport = async (req: AuthRequest, res: Response) => {
  const { data } = req.body;
  const userId = req.user.id;


   const period = new Date()

   const category = data.category;
  try {
    // Validate required fields
    if (!category || !period || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if report already exists for this period
    const existingReport = await pool.query(
      'SELECT id FROM reports WHERE user_id = $1 AND category = $2 AND period = $3',
      [userId, category, period]
    );

    if (existingReport.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Report already exists for this period',
        report_id: existingReport.rows[0].id
      });
    }

    // Insert new report
    const newReport = await pool.query(
      `INSERT INTO reports (user_id, category, period, data) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [userId, category, period, data]
    );

    // Log the action
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'CREATE', 'compliance_report', newReport.rows[0].id, { category, period }]
    );

    res.status(201).json({
      success: true,
      report: newReport.rows[0]
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all reports for a user
export const getUserReports = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, category, status } = req.query;

  try {
    let query = `
      SELECT id, category, period, status, submitted_at, approved_at, created_at
      FROM reports 
      WHERE user_id = $1
    `;
    let countQuery = `SELECT COUNT(*) FROM reports WHERE user_id = $1`;
    let queryParams: any[] = [userId];
    let paramCount = 1;

    // Add filters if provided
    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      countQuery += ` AND category = $${paramCount}`;
      queryParams.push(category);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      countQuery += ` AND status = $${paramCount}`;
      queryParams.push(status);
    }

    // Add pagination
    const offset = (Number(page) - 1) * Number(limit);
    paramCount++;
    query += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
    queryParams.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    queryParams.push(offset);

    // Execute queries
    const reportsResult = await pool.query(query, queryParams);
    const countResult = await pool.query(countQuery, [userId, ...queryParams.slice(1)]);

    res.json({
      reports: reportsResult.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(parseInt(countResult.rows[0].count) / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Submit a report for approval
export const submitReport = async (req: AuthRequest, res: Response) => {
  const { reportId } = req.params;
  const userId = req.user.id;

  try {
    // Verify report belongs to user
    const report = await pool.query(
      'SELECT * FROM reports WHERE id = $1 AND user_id = $2',
      [reportId, userId]
    );

    if (report.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (report.rows[0].status !== 'draft') {
      return res.status(400).json({ error: 'Report already submitted' });
    }

    // Update report status
    const updatedReport = await pool.query(
      `UPDATE reports 
       SET status = 'submitted', submitted_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [reportId]
    );

    // Log the action
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, resource_type, resource_id) 
       VALUES ($1, $2, $3, $4)`,
      [userId, 'SUBMIT', 'compliance_report', reportId]
    );

    res.json({
      success: true,
      report: updatedReport.rows[0]
    });
  } catch (error) {
    console.error('Submit report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};