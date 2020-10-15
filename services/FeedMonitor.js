class FeedMonitor {
    constructor(feeds) {
        this.feeds = feeds;
    }

    process() {
        console.log(this.feeds);
    }
}

module.exports = FeedMonitor;
