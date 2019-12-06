const scanner = require('./scanner.js')
const compiler = require('./compiler.js')
const template = require('./_template.js')
const fileWriter = require('./file-writer.js')
const monitor = require('./monitor.js')
const { sanitizeOptions } = require('../utils')
const path = require('path')

const defaultOptions = {
    pages: './src/pages',
    ignore: [],
    unknownPropWarnings: true,
    dynamicImports: false,
    singleBuild: false,
    outputFile: path.resolve(__dirname + '/../../tmp/routes.js').replace(/\\/g, '/'),
    watch: true
}

module.exports.start = function start(inputOptions) {
    const options = sanitizeOptions(defaultOptions, inputOptions)
    options.pages = path.resolve(options.pages)

    build()

    if (options.watch)
        monitor(options, () => build())

    async function build() {
        const analysis = await scanner(options)
        const routeData = await compiler(analysis)
        const fileContent = template(routeData, options)
        fileWriter(fileContent, options)
    }
}