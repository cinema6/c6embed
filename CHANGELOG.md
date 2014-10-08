# C6Embed Changelog

## v2.2.0 (October 8, 2014)
* Added configuration data necessary for telling the MR Player if it
  is in a standalone configuration
* Started sending a page view to GA when the standalone page loads
* [FIX]: Fix for an issue that caused the production player to be loaded
  in the staging/development environment

## v2.1.0 (October 1, 2014)
* [PERFORMANCE]: Remove an unnecessary AJAX call to improve MR load
  time
* [FIX]: Fix for an issue that could cause the visibility of the splash
  not to be sent to Google Analytics
* [FEATURE]: Added a page for viewing MiniReels by themselves

## v2.0.0 (September 24, 2014)
* [FEATURE]: Added an MR2 embed script that can be used to embed
  multiple MiniReels in a widget, delivered through an ad server
* [FIX]: Fix for an issue that could cause MR2s without brandings
  to behave strangely
* [FIX]: Fixed an issue that caused the MR2 to look broken until
  all the MiniReels had loaded
* [FIX]: Fix for an issue that could cause one missing MiniReel
  to break the entire MR2 widget
* Added additional tracking that will come in handy for A/B testing
* [FIX] Fixed an issue that caused the MR player not to show display
  ads from within the MR2 widget

## v1.5.6 (August 18, 2014)
* [FIX]: Fix for an issue that caused scrolling behind the MiniReel
  Player due to the animated play button

## v1.5.5 (August 16, 2014)
* [FIX]: Fix for an issue that could cause the MR Player to be covered
  up when going fullscreen on some sites

## v1.5.4 (August 15, 2014)
* [FIX]: Fix for an issue that caused the "Play" button to cover up the
  MR Player

## v1.5.3 (August 7, 2014)
* [FIX]: Actual fix for an issue that caused the MiniReel preview page on
  cinema6.com not to work in Safari

## v1.5.2 (August 7, 2014)
* [FIX]: Fix for an issue that caused the MiniReel preview page on
  cinema6.com not to work in Safari

## v1.5.1 (August 7, 2014)
* [FIX]: Fix for an issue that could cause the MiniReel preview page on
  cinema6.com not to work

## v1.5.0 (August 6, 2014)
* Title, branding and splash image are now fetched from the database and
  no longer need to be placed in the embed tag
* [FIX]: Fixed an issue that could cause an asynchronously-loaded embed
  tag not to load

## v1.4.0 (July 22, 2014)
* [FEATURE]: The embed script can now be valid HTML5.
* [FIX]: Fix for an issue that caused the splash page not to show in IE10.
* [FEATURE]: Added ga tracking for when the splash page is viewed.

## v1.3.1 (July 22, 2014)
* [FEATURE]: Added support for the new AMD-ified MR player
* [FIX]: Replacing ga pageviews for open + close with event for open only.

## v1.3.0 (July 11, 2014)
* [FEATURE]: Added support for asynchronous loading of the embed
* [FEATURE]: New GA property for splash page, some new pageviews for the splash

## v1.2.1 (July 2, 2014)
* [FEATURE]: Added custom11 dimension for ga (href) of page containing
  the embed.

## v1.2.0 (June 25, 2014)
* [FEATURE]: The embed script can now attempt to find the "main image"
  of the article and replace it with the MiniReel (to enable, add the
  "data-replace-image" attribute to the embed script
* [FIX]: Fix for an issue that caused the embed not to work in IE
* [FIX]: Fix for an issue that caused the iframe not to appear above
  other content when fullscreened in IE

## v1.1.0 (June 12, 2014)
* [FEATURE]: Preloading is now supported: The app will be preloaded if
  the user mouses over the splash page, or if the data-preload attribute
  is present on the embed tag
* [FEATURE]: A custom branding stylesheet is now added to the DOM to
  allow publisher-by-publisher styling
* [FIX]: Fix for an issue where (if the larger app.js embed script had
  already been downloaded) launching an experience requried two taps on
  iOS.

## v1.0.2 (June 11, 2014)
* [FIX]: Fix for an issue where elements of the parent site would appear
  above a fullscreen experience
* [FIX]: A snapshot is no longer taken of every element in the DOM
* [FIX]: Fix production path to app.js

## v1.0.1 (June 10, 2014)
* [FEATURE]: The major embed API version is now passed along with the
  app data

## v1.0.0 (June 9, 2014)
* [FEATURE]: Added support for new splash page designs with different
  ratios
* [FEATURE]: C6Embed now defers loading the experience/app until after
  the splash page is clicked

## v0.8.5 (May 8, 2014)
* [FIX]: Account for more CSS properties when shrinking down a parent
  page
* [FEATURE]: Deploy c6embed right from this repository without the
  common library project
* [FEATURE]: Add a banner to the built library

## v0.8.4 (May 8, 2014)
* [FIX]: Fix for issue where iframe would not load assets relative to
  the base tag

## v0.8.3 (April 30, 2014)
* Get mode of experience from the data object

## v0.8.2 (April 30, 2014)
* Replaced protocol ref with //

## v0.8.1 (April 29, 2014)
* Started a Changelog
