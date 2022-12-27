import Application from 'layer0-emberjs-example/app'
import config from 'layer0-emberjs-example/config/environment'
import * as QUnit from 'qunit'
import { setApplication } from '@ember/test-helpers'
import { setup } from 'qunit-dom'
import { start } from 'ember-qunit'

setApplication(Application.create(config.APP))

setup(QUnit.assert)

start()
