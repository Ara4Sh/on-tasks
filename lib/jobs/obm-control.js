// Copyright 2015, Renasar Technologies Inc.
/* jslint node: true */

'use strict';

var di = require('di');

module.exports = obmControlJobFactory;
di.annotate(obmControlJobFactory, new di.Provide('Job.Obm.Node'));
di.annotate(obmControlJobFactory, new di.Inject('Logger', 'Q', 'Assert', 'Task.Services.OBM', '_'));
function obmControlJobFactory(Logger, Q, assert, obmService, _) {
    var logger = Logger.initialize(obmControlJobFactory);

    /**
     *
     * @param {Object} options
     * @param {Object} context
     * @constructor
     */
    var ObmControlJob = function ObmControlJob(options, context, taskId) {
        assert.object(options);
        assert.object(context);
        assert.uuid(taskId);
        assert.string(context.target);
        assert.string(options.action);
        assert.ok(_.contains(_.methods(obmService), options.action),
                'OBM action is a known action');

        this.options = options;
        this.taskId = taskId;
        this.nodeId = context.target;
    };

    /**
     * @memberOf ObmControlJob
     * @returns {Q.Promise}
     */
    ObmControlJob.prototype.run = function run() {
        logger.info("Running obm job for node.", {
            id: this.nodeId
        });
        return obmService[this.options.action](this.nodeId);
    };

    /**
     * @memberOf ObmControlJob
     * @returns {Q.Promise}
     */
    ObmControlJob.prototype.cancel = function cancel() {
        return Q.resolve();
    };

    /**
     * static creator
     * @param {Object} options
     * @param {Object} context
     */
    ObmControlJob.create = function(options, context, taskId) {
        return new ObmControlJob(options, context, taskId);
    };


    return ObmControlJob;
}