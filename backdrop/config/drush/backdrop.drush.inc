<?php

require_once('BackdropBoot.php');

/**
 * Take action after any command is run.
 */
function backdrop_bootstrap_candidates() {
  $bootstrap_candidate = 'Drush\Boot\BackdropBoot';
  return new $bootstrap_candidate;
}
