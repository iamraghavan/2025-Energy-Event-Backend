const Match = require('../models/Match');

// CREATE
exports.createMatch = async (req, res, next) => {
  try {
    const match = await Match.create(req.body);

    // ✅ Emit match creation
    req.app.get('io').emit('matchCreated', match);

    res.status(201).json({ success: true, data: match });
  } catch (err) {
    next(err);
  }
};

// READ ALL
exports.getAllMatches = async (req, res, next) => {
  try {
    const matches = await Match.find();
    res.status(200).json({ success: true, data: matches });
  } catch (err) {
    next(err);
  }
};

// READ ONE
exports.getMatchById = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ success: false, message: 'Match not found' });
    res.status(200).json({ success: true, data: match });
  } catch (err) {
    next(err);
  }
};

// FULL REPLACE (PUT)
exports.replaceMatch = async (req, res, next) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, overwrite: true, runValidators: true }
    );

    if (!match)
      return res.status(404).json({ success: false, message: 'Match not found' });

    // ✅ Emit match replace
    req.app.get('io').emit('matchReplaced', match);

    res.status(200).json({ success: true, data: match });
  } catch (err) {
    next(err);
  }
};

// PARTIAL UPDATE (PATCH)
exports.updateMatch = async (req, res, next) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!match)
      return res.status(404).json({ success: false, message: 'Match not found' });

    // ✅ Emit score or patch update
    req.app.get('io').emit('matchUpdated', match);

    res.status(200).json({ success: true, data: match });
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.deleteMatch = async (req, res, next) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) return res.status(404).json({ success: false, message: 'Match not found' });

    // ✅ Emit match deletion
    req.app.get('io').emit('matchDeleted', { matchId: req.params.id });

    res.status(200).json({ success: true, message: 'Match deleted' });
  } catch (err) {
    next(err);
  }
};
