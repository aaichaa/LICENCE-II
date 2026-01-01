import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class JDBCUtils {

    // 1. Constantes pour la connexion
    public static final String LOGIN = "Ton_Login";
    public static final String PASSWORD = "TON_PASSWORD";
    public static final String URL = "Ton_URL";

    // Charge le driver une seule fois
    static {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 2. Méthode static pour obtenir une connexion
    public static Connection getConnexion() {
        try {
            return DriverManager.getConnection(URL, LOGIN, PASSWORD);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 3. Méthode static pour fermer une connexion
    public static void fermerConnexion(Connection connexion) {
        if (connexion != null) {
            try {
                connexion.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    // 4. Méthode utilitaire : exécuter une requête SELECT facilement
    public static ResultSet executerSelect(Connection connexion, String requete) {
        try {
            Statement st = connexion.createStatement();
            return st.executeQuery(requete);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
