const asyncHandler = require("express-async-handler");
const { AnnualFinancialActivities, CreateAnnualActivityValidation } = require("../models/AnnualFinancialActivitiesModel.js");
const { MonthlyFinancialActivities } = require("../models/MonthlyFinancialActivitiesModel.js");

/*--------------------------------------------------
* @desc    Create Annual Financial Activities
* @route   /api/annual-financial-activity/create
* @method  POST
* @access  only admin
----------------------------------------------------*/
module.exports.createAnnualFinancialActivityCtrl = asyncHandler(async (req, res) => {
  // Validate request body
  const { error } = CreateAnnualActivityValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { year, bankFund } = req.body;


// Verifier si cette année et déja generé:
  const annualActivityVerification = await AnnualFinancialActivities.find({year})
  if(annualActivityVerification.length>0){
    return res.status(400).json({
        message: "Annual activities for this year have already been generated."
    })
  }

  // Fetch all monthly financial activities for the given year
  const monthlyActivities = await MonthlyFinancialActivities.find({ year });

  if (!monthlyActivities.length) {
    return res.status(404).json({ message: "No monthly financial records found for the specified year." });
  }

  if (monthlyActivities.length !== 12) {
    return res.status(404).json({ message: "All 12 months must be present for the annual report." });
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





/*--------------------------------------------------
* @desc    Get the latest Monthly Financial Activity
* @route   /api/monthly-financial-activity/latest
* @method  GET
* @access  only admin
----------------------------------------------------*/
module.exports.getLatestAnnualFinancialActivityCtrl = asyncHandler(async (req, res) => {
    try {
        const latestActivity = await AnnualFinancialActivities.findOne().sort({ createdAt: -1 });

        if (!latestActivity) {
            return res.status(404).json({
                message: "No financial activity found!"
            });
        }

        res.status(200).json({
            latestActivity
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});




/*--------------------------------------------------
* @desc    Get One Annual Financial Activities
* @route   /api/annual-financial-activity/getOne
* @method  POST
* @access  only admin
----------------------------------------------------*/
module.exports.getOneAnnualFinancialActivitysCtrl = asyncHandler(async (req, res) => {
    const { year } = req.body;

    // Vérifier que year et month sont fournis
    if (!year) {
        return res.status(400).json({ message: "Year required!" });
    }

    try {
        // Récupérer les données avec un filtre sur l'année et le mois
        const getOne = await AnnualFinancialActivities.findOne({ year })
        .populate("monthlyFinancialActivitiesList") 

        if (!getOne) {
            return res.status(404).json({ message: "No result with this date!" });
        }

        res.status(200).json({getOneAnnualActivitie:getOne});
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});