/**
 * Copyright 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.example.amitaim.automationapp;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.worklight.wlclient.api.WLResponse;
import com.worklight.wlclient.api.challengehandler.WLChallengeHandler;

import org.json.JSONException;
import org.json.JSONObject;

public class AndroidChallengeHandler extends WLChallengeHandler {

	String userName = "";
	String password = "";
	public AndroidChallengeHandler(String realm,String muserName,String mpassword) {
		super(realm);
		userName = muserName;
		password = mpassword;
	}

	public void submitLogin( ){
		JSONObject paramsJson = new JSONObject();
		try {
			paramsJson.put("user", userName);
			paramsJson.put("password", password);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		submitChallengeAnswer(paramsJson);
}

	@Override
	public void handleSuccess(JSONObject identity) {
		Log.d("ResourceRequest", "handleSuccess");
	}

	@Override
	public void handleFailure(JSONObject error) {
		Log.d("ResourceRequest", "handleFailure");
	}

	@Override
	public void handleChallenge(JSONObject challenge) {
		submitLogin();
	}

}
