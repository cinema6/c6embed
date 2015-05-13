# C6Embed Changelog

## v2.29.0 (May 13, 2015)
* [PERFORMANCE]: c6embed now fetches sponsored cards and loads the
  MiniReel Player at the same time (instead of waiting for the sponsored
  cards to fetch first)
* [PERFORMANCE]: Upload code with gzip compression (resulting in files
  about half of their original size)
* [PERFORMANCE]: Add version string to filename of built app.js and
  upload it with a max-age of one year

## v2.28.1 (May 11, 2015)
* [FIX]: Fix for an issue that caused custom pixels not to be fired when
  a static card map was used for a campaign

## v2.28.0 (May 8, 2015)
* [FEATURE]: Make device profile customizable via the object passed to
  c6.loadExperience()
* [FEATURE]: Allow entering fullscreen mode to be prevented via a flag
  on the object passed to c6.loadExperience()
* [FIX]: Fix for an issue that could cause elements with the
  "c6__cant-touch-this" class to still be modified
* [FEATURE]: Add support for tracking pixels specified in the sponsored
  card or MiniReel

## v2.27.2 (May 5, 2015)
* [FEATURE]: Add support for using Player 2.0 with the solo and
  solo-ads modes
* [FIX]: Fix for an issue that caused experiences created for MiniReel
  Player 2.0 not to load

## v2.27.1 (April 30, 2015)
* [FIX]: Fix for an issue that could cause the mobile player not to be
  used in the Android Browser

## v2.27.0 (April 14, 2015)
* [FEATURE]: Add reporting when the page is loaded
* [FEATURE]: Add reporting when the page is closed

## v2.26.0 (April 13, 2015)
* [FEATURE]: Added additional GA reporting to try to shed light on
  strange dropoffs

## v2.25.0 (April 10, 2015)
* [FEATURE]: Add support for using Player 2.0 with the light, lightbox
  and lightbox-playlist modes
* [FEATURE]: Add support for using Player 2.0 on Cinema6 studio preview
  page

## v2.24.4 (April 10, 2015)
* [FIX]: Fix for an issue that caused the MR Player to be shown before
  it was launched on the Digital Journal mobile site

## v2.24.3 (April 6, 2015)
* [FIX]: Support `preview` param in all delivery modes

## v2.24.2 (April 6, 2015)
* [FIX]: Re-enable support for using Player 2.0 with the full mode

## v2.24.1 (April 6, 2015)
* [FIX]: Default to categories on minireel for sponsored card calls
* [FIX]: Remove "full" from player 2.0 whitelist until IE issue is
  resolved

## v2.24.0 (April 2, 2015)
* [FEATURE]: Add support for loading the "full" player via MiniReel Player 2.0

## v2.23.0 (March 31, 2015)
* [FEATURE]: Add support for close button with Jump Ramp

## v2.22.0 (March 27, 2015)
* [FEATURE]: Dynamically fetch WildCards to fill empty placeholders in minireels

## v2.21.0 (March 25, 2015)
* [FEATURE]: Add support for MiniReel Player 2.0

## v2.20.1 (March 16, 2015)
* [FIX]: Fix for an issue that could cause a MiniReel with UTF-8
  characters in the text to appear broken on some sites

## v2.20.0 (March 10, 2015)
* [FIX]: Fetch banners for WildCards inserted into a minireel in the content service
* [FIX]: Preview page passes `campaign` and `preview` params to embed.js for passing to content service

## v2.19.1 (February 26, 2015)
* [FIX]: Trim empty wildcard placeholders

## v2.19.0 (February 20, 2015)
* [FIX]: Stop duplicated Show event and timing when re-opening a MR.
* [DEPRECATION]: Remove ability to automatically replace an image with a
  MiniReel embed using the OpenGraph API
* [FEATURE]: Add ability to replace a DOM element with a MiniReel embed
  by passing in its CSS selector

## v2.18.0 (February 18, 2015)
* [FEATURE]: Add exception handler around makeAdCall completion function in lib/SponsoredCard.js
* [FEATURE]: Adtech trackingUrl will only fire once per MR
* [FEATURE]: Add GA AttemptShow event to Embed,Jsonp,MR2 embeds - fired first time user clicks splash

## v2.17.1 (February 13, 2015)
* [FEATURE]: Stretch out adtech timeouts if MR is preloaded

## v2.17.0 (February 12, 2015)
* [FEATURE]: Allow 3rd-party sponsored card tracking pixels to be fired
* [FEATURE]: Allow 3rd-party pixels to be fired when a MiniReel is
  launched
* [FEATURE]: Added support for A/B testing branding
* [FIX]: Fix for an issue that could cause sponsored cards not to load
  if no 3rd-party pixels are specified

## v2.16.0 (February 10, 2015)
* [FEATURE]: Provide summary and sponsor information in JSONP responses

## v2.15.0 (January 27, 2015)
* [FEATURE]: Add ability to override lookup of player index.html
* [FEATURE]: Pass container up to content service when getting experiences
* [FEATURE]: Move lightbox override to jsonp/mr2 handlers, stop sending context to service
* [FIX]: Remove page+title params for SponsoredCards GA report (will pick up defaults).

## v2.14.0 (January 23, 2015)
* [FEATURE]: Making adtech network and server address somewhat more configurable

## v2.13.0 (January 20, 2015)
* [FEATURE]: Adding context,container and MR2 group ids to GA hits reports
* [FEATURE]: Sening context,container and MR2 group id into the player on initAnalytics ping
* [FEATURE]: Make wildcard placement id overridable from mr2 configuration

## v2.12.1 (December 29, 2014)
* [FIX]: Fix for an issue that caused the standalone player not to work
  in staging

## v2.12.0 (December 29, 2014)
* [FEATURE]: Adding user timings to embed

## v2.11.0 (December 22, 2014)
* [FEATURE]: Adding lots additional GA properties for the Player
* [FIX]: Changed GA error report to make it cleaner for analysis when SponsoredCard trimmed

## v2.10.0 (December 19, 2014)
* [FEATURE]: Preloader animation added for full page MRs
* Modified C6AJAX to be more like Angular $http in hopes of resolving
  strange AJAX errors reported in GA
* Make full unexpected AJAX response object show up in GA errors

## v2.9.2 (December 17, 2014)
* [FIX]: Sending Visible events for standalone and jsonp players to fix issues in reports
* Added a more useful error if the MR Player's index.html file is not what
  is expected
* Send SponsoredCardRemoved events when sponsored cards are removed

## v2.9.1 (December 15, 2014)
* Made change to potentially improve the stability of XHR requests
* Added more robust GA error reporting
* [FIX]: Fix for an issue that caused c6embed to fail silently if it was
  appended to the page via JS

## v2.9.0 (December 11, 2014)
* [FEATURE]: New GA account ids for embeds.
* [FEATURE]: Sending some errors to GA.
* [FEATURE]: Support autoplaying videos on the first slide in mobile

## v2.8.2 (December 9, 2014)
* [FIX]: Fix for an issue that caused MiniReels with sponsored cards not
  to load.

## v2.8.1 (December 4, 2014)
* [FIX]: Fixed an issue that caused sponsored cards to remain in MR if no placement is found.

## v2.8.0 (December 3, 2014)
* [FEATURE] Added ability to override sponsored card tracking behavior
  on standalone player via special URL parameters
* Started passing container parameter to content service from JSONP
  endpoint script
* [FIX]: Fixed an issue that caused MRs with sponsored cards not to work
  on secure webpages

## v2.7.0 (November 19, 2014)
* [FEATURE]: Added the provided query params to the JSONP response
* Experiences are now preloaded when fetched via JSONP

## v2.6.0 (November 14, 2014)
* [FEATURE]: Added a script to function as a JSONP endpoint for fetching
  MiniReels based on an Ad Server recommendation

## v2.5.0 (November 11, 2014)
* Fetch ClickUrl and AdCountUrl from ADTECH for sponsored cards
* [FIX]: Fix for an issue that caused preview pages on the new short
  URLs in production to look for MiniReels in the staging environment

## v2.4.0 (October 29, 2014)
* Added support for the single-video player to the standalone page

## v2.3.0 (October 21, 2014)
* Added a page for previewing non-active MiniReels

## v2.2.0 (October 8, 2014)
* Added configuration data necessary for telling the MR Player if it
  is in a standalone configuration
* Started sending a page view to GA when the standalone page loads
* [FIX]: Fix for an issue that caused the production player to be loaded
  in the staging/development environment
* [FIX]: Fix for an issue that caused the mobile standalone page to look
  zoomed-in in landscape mode
* [FIX]: Fix for an issue that caused the page not to load in the
  staging environment

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
