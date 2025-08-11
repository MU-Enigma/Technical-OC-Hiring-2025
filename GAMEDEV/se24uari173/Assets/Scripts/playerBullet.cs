using UnityEngine;

public class playerBullet : MonoBehaviour
{
    public float stopDuration = 2f;
    [SerializeField] private AudioClip enemyStun;
    [SerializeField] private AudioClip pickupClip; // sound for lethal bullet gain

    void OnCollisionEnter2D(Collision2D collision)
    {
        // Case 1: Hits Enemy
        if (collision.gameObject.layer == LayerMask.NameToLayer("Enemy"))
        {
            soundManager.instance.PlaySoundClip(enemyStun, transform, 1f);

            shootScript shooter = FindAnyObjectByType<shootScript>();
            if (shooter != null)
            {
                shooter.StartCooldown();
            }

            enemyAi ai = collision.gameObject.GetComponent<enemyAi>();
            if (ai != null)
            {
                ai.Freeze(stopDuration);
            }
        }

        // Case 2: Hits Enemy Bullet
        else if (collision.gameObject.layer == LayerMask.NameToLayer("Enemy Bullet"))
        {
            // Increase lethal bullet count
            bulletPickup.bulletCount++;
            bulletPickup.instance.UpdateUI();

            if (pickupClip != null)
                soundManager.instance.PlaySoundClip(pickupClip, transform, 1f);
        }

        // Destroy player bullet after any collision
        Destroy(gameObject);
    }
}
