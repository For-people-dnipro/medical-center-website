'use strict';

module.exports = {
  async up(trx) {
    const tableName = 'home_sliders';
    const hasTable = await trx.schema.hasTable(tableName);

    if (!hasTable) {
      return;
    }

    const hasButtonEnabled = await trx.schema.hasColumn(tableName, 'button_enabled');
    if (!hasButtonEnabled) {
      await trx.schema.alterTable(tableName, (table) => {
        table.boolean('button_enabled').defaultTo(false);
      });
    }

    const hasButtonColor = await trx.schema.hasColumn(tableName, 'button_color');
    if (!hasButtonColor) {
      await trx.schema.alterTable(tableName, (table) => {
        table.string('button_color', 20).defaultTo('#FFFFFF');
      });
    }

    const hasLegacyShowButton = await trx.schema.hasColumn(tableName, 'show_button');
    if (hasLegacyShowButton) {
      await trx.raw(
        'UPDATE ?? SET ?? = COALESCE(??, ?) WHERE ?? IS NULL OR ?? = ?',
        [
          tableName,
          'button_enabled',
          'show_button',
          false,
          'button_enabled',
          'button_enabled',
          false,
        ]
      );
    }

    await trx(tableName)
      .whereNull('button_color')
      .orWhere('button_color', '')
      .update({ button_color: '#FFFFFF' });
  },

  async down() {},
};
