import java.sql.*;
import java.util.Scanner;

/**
 * ConnexionPostgres
 * - Se connecte à PostgreSQL
 * - Propose un menu pour exécuter les requêtes Questions 1 à 5 du sujet
 *
 * IMPORTANT : adapte url/user/password à ton environnement.
 */
public class ConnexionPostgres_fixed {

    // ======== Configuration connexion ========
    // Remplacer selon votre configuration
    private static final String URL = "jdbc:postgresql://localhost:5432/postgres"; 
    private static final String USER = "postgres";                               // ex: sb1245366
    private static final String PASSWORD = "Aissatou";                           // ex: sb1245366

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        try {
            // 1) Charger le driver
            Class.forName("org.postgresql.Driver");

            // 2) Connexion
            try (Connection connexion = DriverManager.getConnection(URL, USER, PASSWORD)) {
                System.out.println("Connexion reussie !");

                // 3) Menu
                while (true) {
                    System.out.println();
                    System.out.println("===== MENU =====");
                    System.out.println("1 - Question 1 : maintenance machines (fenetre de dates)");
                    System.out.println("2 - Question 2 : seances d'un client (specialisee + coaching)");
                    System.out.println("3 - Question 3 : clients avec <= 1 seance specialisee incluse (par abonnement)");
                    System.out.println("4 - Question 4 : clients NON abonnes qui auraient economise avec le plus petit abonnement (periode)");
                    System.out.println("5 - Question 5 : coachs avec nb clients > moyenne");
                    System.out.println("0 - Quitter");
                    System.out.print("Choix : ");

                    int choix;
                    try {
                        choix = Integer.parseInt(sc.nextLine().trim());
                    } catch (NumberFormatException e) {
                        System.out.println("Choix invalide.");
                        continue;
                    }

                    switch (choix) {
                        case 0:
                            System.out.println("Au revoir.");
                            return;

                        case 1:
                            executerQuestion1(connexion, sc);
                            break;

                        case 2:
                            executerQuestion2(connexion, sc);
                            break;

                        case 3:
                            executerQuestion3(connexion);
                            break;

                        case 4:
                            executerQuestion4(connexion, sc);
                            break;

                        case 5:
                            executerQuestion5(connexion);
                            break;

                        default:
                            System.out.println("Choix invalide.");
                    }
                }
            }

        } catch (ClassNotFoundException e) {
            System.out.println("Erreur : Driver PostgreSQL introuvable !");
            e.printStackTrace();

        } catch (SQLException e) {
            System.out.println("Erreur SQL !");
            e.printStackTrace();

        } finally {
            sc.close();
        }
    }

    // =========================
    // QUESTION 1
    // =========================
    private static void executerQuestion1(Connection connexion, Scanner sc) throws SQLException {
        System.out.println("\n[Q1] Fenetre de dates pour prochaine maintenance");
        System.out.print("Date debut (YYYY-MM-DD) [defaut: 2025-12-12] : ");
        String d1s = sc.nextLine().trim();
        if (d1s.isEmpty()) d1s = "2025-12-12";

        System.out.print("Date fin   (YYYY-MM-DD) [defaut: 2026-01-12] : ");
        String d2s = sc.nextLine().trim();
        if (d2s.isEmpty()) d2s = "2026-01-12";

        String q1 =
                "SELECT " +
                "    m.id AS machine_id, " +
                "    m.nom AS machine_nom, " +
                "    MAX(maint.date_maintenance) AS derniere_maintenance, " +
                "    MAX(maint.date_maintenance) + tm.intervalle_revision * INTERVAL '1 day' AS prochaine_maintenance " +
                "FROM sds.machine m " +
                "JOIN sds.type_machine tm ON m.type_machine_id = tm.id " +
                "JOIN sds.maintenance maint ON maint.machine_id = m.id " +
                "GROUP BY m.id, m.nom, tm.intervalle_revision " +
                "HAVING (MAX(maint.date_maintenance) + tm.intervalle_revision * INTERVAL '1 day') BETWEEN ? AND ? " +
                "ORDER BY m.id;";

        try (PreparedStatement ps = connexion.prepareStatement(q1)) {
            ps.setDate(1, Date.valueOf(d1s));
            ps.setDate(2, Date.valueOf(d2s));
            try (ResultSet rs = ps.executeQuery()) {
                printResultSet(rs);
            }
        }
    }

    // =========================
    // QUESTION 2
    // =========================
    private static void executerQuestion2(Connection connexion, Scanner sc) throws SQLException {
        System.out.println("\n[Q2] Seances d'un client (specialisee + coaching)");
        System.out.print("Client id [defaut: 2] : ");
        String s = sc.nextLine().trim();
        int clientId = s.isEmpty() ? 2 : Integer.parseInt(s);

        String q2 =
                "SELECT 'specialisee' AS type, ss.date_seance, ss.theme, ss.duree " +
                "FROM sds.inscription_seance_specialisee iss " +
                "JOIN sds.seance_specialisee ss ON ss.id = iss.seance_specialisee_id " +
                "WHERE iss.client_id = ? " +
                "UNION ALL " +
                "SELECT 'coaching' AS type, sc.date_seance, 'Coaching' AS theme, sc.duree " +
                "FROM sds.seance_coaching sc " +
                "WHERE sc.client_id = ?;";

        try (PreparedStatement ps = connexion.prepareStatement(q2)) {
            ps.setInt(1, clientId);
            ps.setInt(2, clientId);
            try (ResultSet rs = ps.executeQuery()) {
                printResultSet(rs);
            }
        }
    }

    // =========================
    // QUESTION 3
    // =========================
    private static void executerQuestion3(Connection connexion) throws SQLException {
        System.out.println("\n[Q3] Clients avec <= 1 seance specialisee incluse (par abonnement)");

        String q3 =
                "SELECT " +
                "    c.id, " +
                "    c.nom, " +
                "    c.prenom, " +
                "    COUNT(ss.id) AS nb_seances_inclues " +
                "FROM sds.client c " +
                "JOIN sds.abonnement a ON a.client_id = c.id " +
                "JOIN sds.abonnement_prestation ap ON ap.id_abonnement = a.id " +
                "JOIN sds.prestation p ON p.id = ap.id_prestation " +
                "   AND p.type_prestation = 'Seances specialisees' " +
                "LEFT JOIN sds.inscription_seance_specialisee iss ON iss.client_id = c.id " +
                "LEFT JOIN sds.seance_specialisee ss ON ss.id = iss.seance_specialisee_id " +
                "   AND ss.date_seance BETWEEN a.date_debut AND a.date_fin " +
                "   AND iss.montant = 0 " +
                "GROUP BY c.id, c.nom, c.prenom " +
                "HAVING COUNT(ss.id) <= 1 " +
                "ORDER BY c.id;";

        try (Statement st = connexion.createStatement();
             ResultSet rs = st.executeQuery(q3)) {
            printResultSet(rs);
        }
    }

    // =========================
    // QUESTION 4
    // =========================
    private static void executerQuestion4(Connection connexion, Scanner sc) throws SQLException {
        System.out.println("\n[Q4] Clients non abonnes qui auraient economise avec le plus petit abonnement");
        System.out.print("Date debut (YYYY-MM-DD) [defaut: 2025-02-01] : ");
        String d1s = sc.nextLine().trim();
        if (d1s.isEmpty()) d1s = "2025-02-01";

        System.out.print("Date fin   (YYYY-MM-DD) [defaut: 2025-02-28] : ");
        String d2s = sc.nextLine().trim();
        if (d2s.isEmpty()) d2s = "2025-02-28";

        // Version paramétrée : même période pour les dépenses et pour vérifier "non abonné sur la période"
        String q4 =
                "SELECT " +
                "    c.id, c.nom, c.prenom, " +
                "    SUM(d.montant) AS total_depenses, " +
                "    abo.prix AS prix_abonnement, " +
                "    SUM(d.montant) - abo.prix AS economie " +
                "FROM sds.client c " +
                "CROSS JOIN (SELECT MIN(prix) AS prix FROM sds.abonnement) abo " +
                "LEFT JOIN ( " +
                "    SELECT iss.client_id AS id, iss.montant, ss.date_seance " +
                "    FROM sds.inscription_seance_specialisee iss " +
                "    JOIN sds.seance_specialisee ss ON ss.id = iss.seance_specialisee_id " +
                "    WHERE iss.montant > 0 " +
                "    UNION ALL " +
                "    SELECT sc.client_id AS id, sc.montant, sc.date_seance " +
                "    FROM sds.seance_coaching sc " +
                "    WHERE sc.montant > 0 " +
                ") d ON d.id = c.id AND d.date_seance BETWEEN ? AND ? " +
                "WHERE NOT EXISTS ( " +
                "    SELECT 1 FROM sds.abonnement a " +
                "    WHERE a.client_id = c.id " +
                "      AND a.date_debut <= ? " +
                "      AND a.date_fin   >= ? " +
                ") " +
                "GROUP BY c.id, c.nom, c.prenom, abo.prix " +
                "HAVING COALESCE(SUM(d.montant), 0) > abo.prix " +
                "ORDER BY economie DESC;";

        Date d1 = Date.valueOf(d1s);
        Date d2 = Date.valueOf(d2s);

        try (PreparedStatement ps = connexion.prepareStatement(q4)) {
            ps.setDate(1, d1);
            ps.setDate(2, d2);
            ps.setDate(3, d2); // a.date_debut <= date_fin
            ps.setDate(4, d1); // a.date_fin   >= date_debut
            try (ResultSet rs = ps.executeQuery()) {
                printResultSet(rs);
            }
        }
    }

    // =========================
    // QUESTION 5
    // =========================
    private static void executerQuestion5(Connection connexion) throws SQLException {
        System.out.println("\n[Q5] Coachs avec nb clients > moyenne");

        String q5 =
                "WITH coach_client AS ( " +
                "    SELECT ss.id_coach AS coach_id, iss.client_id " +
                "    FROM sds.inscription_seance_specialisee iss " +
                "    JOIN sds.seance_specialisee ss ON ss.id = iss.seance_specialisee_id " +
                "    UNION " +
                "    SELECT sc.coach_id, sc.client_id " +
                "    FROM sds.seance_coaching sc " +
                "), " +
                "coach_stats AS ( " +
                "    SELECT coach_id, COUNT(DISTINCT client_id) AS nb_clients " +
                "    FROM coach_client " +
                "    GROUP BY coach_id " +
                "), " +
                "moyenne AS ( " +
                "    SELECT AVG(nb_clients) AS avg_clients " +
                "    FROM coach_stats " +
                ") " +
                "SELECT c.id, c.nom, c.prenom, cs.nb_clients " +
                "FROM coach_stats cs " +
                "JOIN sds.coach c ON c.id = cs.coach_id " +
                "CROSS JOIN moyenne m " +
                "WHERE cs.nb_clients > m.avg_clients " +
                "ORDER BY cs.nb_clients DESC;";

        try (Statement st = connexion.createStatement();
             ResultSet rs = st.executeQuery(q5)) {
            printResultSet(rs);
        }
    }

    // ======== Affichage générique ResultSet ========
    private static void printResultSet(ResultSet rs) throws SQLException {
        ResultSetMetaData md = rs.getMetaData();
        int n = md.getColumnCount();

        // Header
        StringBuilder header = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            header.append(md.getColumnLabel(i));
            if (i < n) header.append(" | ");
        }
        System.out.println(header);

        // Rows
        int count = 0;
        while (rs.next()) {
            StringBuilder row = new StringBuilder();
            for (int i = 1; i <= n; i++) {
                Object v = rs.getObject(i);
                row.append(v == null ? "NULL" : v.toString());
                if (i < n) row.append(" | ");
            }
            System.out.println(row);
            count++;
        }

        if (count == 0) {
            System.out.println("(0 ligne)");
        }
    }
}
