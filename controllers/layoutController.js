const Layout = require('../models/Layout');

// GET current layout
exports.getLayout = async (req, res) => {
  try {
    let layout = await Layout.findOne();
    if (!layout) {
      layout = await Layout.create({});
    }
    res.json({ success: true, data: layout });
  } catch (err) {
    console.error('[getLayout]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST or PATCH layout
exports.updateLayout = async (req, res) => {
  try {
    const { quadrant1, quadrant2, quadrant3, quadrant4 } = req.body;

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

    req.app.get('io').emit('layoutUpdated', layout);

    res.json({ success: true, message: 'Layout updated', data: layout });
  } catch (err) {
    console.error('[updateLayout]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
