const wdioLogger = require('@wdio/logger').default
const logger = wdioLogger('wdio-eslinter-service')

class EslintLauncherService {

    constructor(serviceOptions, capabilities, config) {
        this.options = serviceOptions ? serviceOptions : {}
        if(!this.options.runnerType)
            this.options.runnerType = 'npm';
        if(!this.options.scriptName)
            this.options.scriptName = 'eslint';
        logger.warn(`initialize wdio-eslinter-service using ${this.options.runnerType} runner.`)
    }

    onPrepare(config, capabilities) {
        return new Promise((resolve, reject) => {
            const { SevereServiceError } = require('webdriverio')
            const runEslint = require(`./eslint-${this.options.runnerType}-runner`)
            return runEslint(this.options.scriptName).then((code) => {
                logger.info('eslint checks passed...')
                resolve()
            }).catch((err) => {
                reject(err)
            })
        }).catch((err) => {
            logger.error('SEVERE: Code contains eslint errors or eslint not installed. Exiting...')
            process.exit(1)
        })
    }
}

module.exports = EslintLauncherService;
