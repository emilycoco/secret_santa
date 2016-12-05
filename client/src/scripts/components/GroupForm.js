import React, { Component } from 'react';

export default class GroupForm extends Component {
    createGroup() {

    }
    render() {
        return (
            <form onSubmit={this.createGroup}>
                <input placeholder="Group name" value=""/>
                <input placeholder="Group password" value=""/>
                <input placeholder="Group end date" value=""/>
                <button type="submit">Create Group</button>
            </form>
        )
    }
}