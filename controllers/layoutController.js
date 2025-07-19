const Layout = require('../models/Layout');
const Sport = require('../models/Sport');

// GET current layout + optional sport names
exports.getLayout = async (req, res) => {
  try {
    let layout = await Layout.findOne();
    if (!layout) {
      layout = await Layout.create({});
    }

    // Lookup sport names for all quadrants
    const sportIds = [layout.quadrant1, layout.quadrant2, layout.quadrant3, layout.quadrant4].filter(Boolean);
    const sports = await Sport.find({ sportId: { $in: sportIds } });

    const getSport = (id) => sports.find(s => s.sportId === id);

    res.json({
      success: true,
      data: {
        ...layout.toObject(),
        sports: {
          q1: getSport(layout.quadrant1),
          q2: getSport(layout.quadrant2),
          q3: getSport(layout.quadrant3),
          q4: getSport(layout.quadrant4),
        }
      }
    });
  } catch (err) {
    console.error('[getLayout]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST or PATCH layout
exports.updateLayout = async (req, res) => {
  try {
    const { quadrant1, quadrant2, quadrant3, quadrant4 } = req.body;
    const sportIds = [quadrant1, quadrant2, quadrant3, quadrant4].filter(Boolean);

    // Validate all sportIds
    const valid = await Sport.find({ sportId: { $in: sportIds } });
    if (valid.length !== sportIds.length) {
      return res.status(400).json({ message: 'Invalid sportId provided in layout' });
    }

    let layout = await Layout.findOne();
    if (!layout) {
      layout = await Layout.create({ quadrant1, quadrant2, quadrant3, quadrant4 });
    } else {
      layout.quadrant1 = quadrant1;
      layout.quadrant2 = quadrant2;
      layout.quadrant3 = quadrant3;
      layout.quadrant4 = quadrant4;
      await layout.save();
    }

    req.app.get('io').emit('layoutUpdated', layout); // emit update

    res.json({ success: true, message: 'Layout updated', data: layout });
  } catch (err) {
    console.error('[updateLayout]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
