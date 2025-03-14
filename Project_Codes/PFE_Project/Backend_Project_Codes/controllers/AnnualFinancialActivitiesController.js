const asyncHandler = require("express-async-handler");
const { AnnualFinancialActivities, CreateAnnualActivityValidation } = require("../models/AnnualFinancialActivitiesModel.js");
const { MonthlyFinancialActivities } = require("../models/MonthlyFinancialActivitiesModel.js");

/*--------------------------------------------------
* @desc    Create Annual Financial Activities
* @route   /api/annual-financial-activity/create
* @method  POST
* @access  only admin
----------------------------------------------------*/
const createAnnualFinancialActivity = asyncHandler(async (req, res) => {
  // Validate request body
  const { error } = CreateAnnualActivityValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { year, bankFund } = req.body;

  // Fetch all monthly financial activities for the given year
  const monthlyActivities = await MonthlyFinancialActivities.find({ year });

  if (!monthlyActivities.length) {
    return res.status(404).json({ message: "No monthly financial records found for the specified year." });
  }

  // Calculate totals
  const totalRevenue = monthlyActivities.reduce((sum, activity) => sum + (activity.totalRevenue || 0), 0);
  const totalExpenses = monthlyActivities.reduce((sum, activity) => sum + (activity.totalExpenses || 0), 0);
  const rest = totalRevenue - totalExpenses;
  const globalRest = rest + bankFund;

  // Determine financial status
  let financialStatus = "Critical";
  let comment = "The financial situation is critical, no profit.";

  if (rest > 0) {
    financialStatus = "Good";
    comment = "The financial situation is stable and profitable.";
  } else if (rest < 0) {
    financialStatus = "Bad";
    comment = "The financial situation is negative, losses recorded.";
  }

  // Create a new annual financial activity
  const annualActivity = new AnnualFinancialActivities({
    year,
    bankFund,
    totalRevenue,
    totalExpenses,
    rest,
    globalRest,
    financialStatus,
    comment,
    monthlyFinancialActivitiesList: monthlyActivities.map(activity => activity._id),
  });

  // Save to the database
  await annualActivity.save();

  res.status(201).json({
    message: "Annual Financial Activity created successfully",
    annualActivity,
  });
});

module.exports = { createAnnualFinancialActivity };
