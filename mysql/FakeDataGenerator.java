import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

public class FakeDataGenerator {

    static Random rand = new Random();
    static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    static String now() {
        return sdf.format(new Date());
    }

    static String genUsername(int i) {
        return String.format("user%04d", i);
    }

    static String genEmail(int i) {
        return String.format("user%04d@example.com", i);
    }

    static String genProductName(int i) {
        return "產品" + i;
    }

    static String genCategory() {
        // 假設 category_id 1~6
        return String.valueOf(rand.nextInt(6) + 1);
    }

    static String genRoleId() {
        // 1=admin, 2=seller, 3=buyer
        int r = rand.nextInt(10);
        if (r == 0) return "1";   // 10% admin
        else if (r < 3) return "2"; // 20% seller
        else return "3"; // 70% buyer
    }

    public static void main(String[] args) throws IOException {

        FileWriter fw = new FileWriter("fake_data.sql");

        fw.write("-- 生成 1000 users\n");
        for (int i = 1; i <= 1000; i++) {
            String user = String.format(
                "INSERT INTO users (id, username, hash_password, hash_salt, email, role_id, created_at, is_active, is_email_verified) VALUES " +
                "(%d, '%s', SHA2(CONCAT('password123', 'salt%04d'), 256), 'salt%04d', '%s', %s, '%s', TRUE, TRUE);\n",
                i, genUsername(i), i, i, genEmail(i), genRoleId(), now());
            fw.write(user);
        }

        fw.write("\n-- 生成 2000 products\n");
        for (int i = 1; i <= 2000; i++) {
            String product = String.format(
                "INSERT INTO products (id, name, description, price, stock, image_url, category_id, created_at) VALUES " +
                "(%d, '%s', '產品 %d 的描述', %.2f, %d, 'http://example.com/img/prod%04d.jpg', %s, '%s');\n",
                i, genProductName(i), i, rand.nextDouble() * 5000 + 100, rand.nextInt(200), i, genCategory(), now());
            fw.write(product);
        }

        fw.write("\n-- 生成 2000 orders\n");
        for (int i = 1; i <= 2000; i++) {
            int userId = rand.nextInt(1000) + 1;
            int sellerId = rand.nextInt(100) + 1; // 假設前 100 users 是賣家
            String order = String.format(
                "INSERT INTO orders (id, user_id, seller_id, order_date, order_status, payment_status, shipment_status, total_amount, created_at) VALUES " +
                "(%d, %d, %d, '%s', 'PAID', 'PAID', 'DELIVERED', %.2f, '%s');\n",
                i, userId, sellerId, now(), rand.nextDouble() * 10000 + 100, now());
            fw.write(order);
        }

        fw.write("\n-- 生成 2000 order_items\n");
        for (int i = 1; i <= 2000; i++) {
            int orderId = i;
            int productId = rand.nextInt(2000) + 1;
            int quantity = rand.nextInt(5) + 1;
            double unitPrice = rand.nextDouble() * 5000 + 100;
            double totalPrice = unitPrice * quantity;
            String orderItem = String.format(
                "INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price, created_at) VALUES " +
                "(%d, %d, %d, %d, %.2f, %.2f, '%s');\n",
                i, orderId, productId, quantity, unitPrice, totalPrice, now());
            fw.write(orderItem);
        }

        fw.write("\n-- 生成 5000 cart_items\n");
        for (int i = 1; i <= 5000; i++) {
            int userId = rand.nextInt(1000) + 1;
            int productId = rand.nextInt(2000) + 1;
            int quantity = rand.nextInt(3) + 1;
            String cartItem = String.format(
                "INSERT INTO cart_items (id, user_id, product_id, quantity, added_at) VALUES " +
                "(%d, %d, %d, %d, '%s');\n",
                i, userId, productId, quantity, now());
            fw.write(cartItem);
        }

        fw.close();

        System.out.println("SQL 假資料已生成至 fake_data.sql");
    }
}
