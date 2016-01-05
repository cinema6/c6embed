jsfile = open('./page.js',"r");
asfile = open('../com/reelcontent/vpaidplayer/page/PageConstant.as', "w");

alllines = jsfile.readlines();
lines = [];
asOutput = "package com.reelcontent.vpaidplayer.page\n";
asOutput += "{\n";
asOutput += "  internal class PageConstant\n";
asOutput += "  {\n";
asOutput += "    private static const EMBED_JS_SCRIPT:String = \n";

for i in range(0, len(alllines) ):
    stripped = alllines[i].lstrip()
    try:
        if stripped[0] != '/':
            alllines[i] = alllines[i].replace("'", "\\'");
            alllines[i] = alllines[i].replace("\\\\'", "\\'");
            lines.append(alllines[i]);
    except IndexError:
        lines.append('\n');

for line in lines:
    line = '        ' + line;
    try:
        if line.rstrip()[0]:
            asOutput += "'" + line.rstrip() + "' +\n";
    except:
        asOutput += '\n';

asOutput = asOutput.rstrip(' +\n');

asOutput += ';\n\n';

asOutput += "public static function getEmbedJsScript():String {\n";
asOutput += "  return EMBED_JS_SCRIPT;\n";
asOutput += "}\n";

asOutput += "}\n";
asOutput += "}\n";

asfile.writelines(asOutput);

#print asOutput;
