const delayed_message_exchange = 'delayed-message-exchange';
const rabbitmq_mqtt_exchange = 'amq.topic';
const pattern = '';

require('amqplib/callback_api')
    .connect('amqp://localhost', function (err, conn) {
        if (err != null) bail(err);
        publisher(conn);
    });

function bail(err) {
    console.error(err);
    process.exit(1);
}

// Publish message
function publisher(conn) {
    conn.createChannel(on_open);
    function on_open(err, ch) {
        if (err != null) bail(err);

        // create and configure exchange if not exist
        ch.assertExchange(delayed_message_exchange, 'x-delayed-message', { durable: true, arguments: { 'x-delayed-type': 'direct' } });
        ch.bindExchange(rabbitmq_mqtt_exchange, delayed_message_exchange, pattern);

        const headers = { 'x-delay': 3000 };
        ch.publish(delayed_message_exchange, pattern, Buffer.from((Date.now()).toString()), { headers });
    }
}
