import React from 'react';

import CoreCancelledCasts from 'parser/core/modules/CancelledCasts';
import SPELLS from 'common/SPELLS';
import SPECS from 'game/SPECS';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';
import { STATISTIC_ORDER } from 'interface/others/StatisticBox';

class CancelledCasts extends CoreCancelledCasts {
  static IGNORED_ABILITIES = [
    //Include the spells that you do not want to be tracked and spells that are castable while casting (Like Fire Blast, Combustion, or Shimmer)
    SPELLS.FIRE_BLAST.id,
    SPELLS.COMBUSTION.id,
    SPELLS.SHIMMER_TALENT.id,
    SPELLS.ICE_FLOES_TALENT.id,
    SPELLS.DISPLACEMENT.id,
  ];

  get cancelledPercentage() {
    return this.castsCancelled / this.totalCasts;
  }

  get suggestionThresholds() {
    return {
      actual: this.cancelledPercentage,
      isGreaterThan: {
        minor: 0.05,
        average: 0.1,
        major: 0.2,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    let extraMovementSpell = null;
    if(this.selectedCombatant.specId === SPECS.FROST_MAGE.id) {
      extraMovementSpell = <React.Fragment>, and <SpellLink id={SPELLS.ICE_FLOES_TALENT.id} /></React.Fragment>;
    } else if(this.selectedCombatant.specId === SPECS.ARCANE_MAGE.id) {
      extraMovementSpell = <React.Fragment>, and <SpellLink id={SPELLS.SLIPSTREAM_TALENT.id} /></React.Fragment>;
    }
    const joiner = extraMovementSpell === null ? ' and ' : ', ';

    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<React.Fragment>You cancelled {formatPercentage(this.cancelledPercentage)}% of your spells. While it is expected that you will have to cancel a few casts to react to boss mechanics or move, you should try to ensure that you are cancelling as few casts as possible by utilizing movement abilities such as <SpellLink id={SPELLS.BLINK.id} />{joiner}<SpellLink id={SPELLS.SHIMMER_TALENT.id} />{extraMovementSpell}.</React.Fragment>)
          .icon('inv_misc_map_01')
          .actual(`${formatPercentage(actual)}% casts cancelled`)
          .recommended(`<${formatPercentage(recommended)}% is recommended`);
      });
  }

  statisticOrder = STATISTIC_ORDER.CORE(2);
}

export default CancelledCasts;
