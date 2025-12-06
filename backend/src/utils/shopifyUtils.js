const buildSyncParams = (sinceId) => ({
  limit: 250,
  since_id: sinceId
});

module.exports = {
  buildSyncParams
};
