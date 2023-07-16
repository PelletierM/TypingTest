from flask_assets import Bundle

bundles = {

    "app_css": Bundle(
        # Link to main scss file
        "../static/styles/main.scss",
        depends="../static/styles/*.scss",
        filters="libsass",
        output="../static/gen/build/app.%(version)s.css"
    ),

    "app_js": Bundle(
        # Link to generated js files
        "../static/gen/index.js",
        filters="jsmin",
        output="../static/gen/build/app.%(version)s.js"
    )
}