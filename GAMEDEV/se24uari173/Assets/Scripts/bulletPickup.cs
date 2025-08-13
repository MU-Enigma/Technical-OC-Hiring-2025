using UnityEngine;
using UnityEngine.UI;

public class bulletPickup : MonoBehaviour
{
    public static bulletPickup instance;
    public static int bulletCount = 0;

    [Header("UI Settings")]
    public Text bulletCountText;
    public Transform player;
    [SerializeField] private AudioClip pickupClip;

    private void Awake()
    {
        instance = this;
    }

    void Start()
    {
        UpdateUI();
        if (player == null)
        {
            GameObject playerObj = GameObject.FindGameObjectWithTag("Player");
            if (playerObj != null)
                player = playerObj.transform;
        }
    }

    void Update()
    {
        if (player == null) return;

        Collider2D[] pickups = Physics2D.OverlapCircleAll(player.position, 1f, LayerMask.GetMask("bulletPickup"));
        foreach (Collider2D pickup in pickups)
        {
            if (pickup.CompareTag("bulletPickup"))
            {
                AddBullet(1);
                soundManager.instance.PlaySoundClip(pickupClip, transform, 1f);
                Destroy(pickup.gameObject);
            }
        }

        if (Input.GetKeyDown(KeyCode.P)) // debug
        {
            AddBullet(1);
            soundManager.instance.PlaySoundClip(pickupClip, transform, 1f);
        }
    }

    public void AddBullet(int amount)
    {
        bulletCount += amount;
        UpdateUI();
    }

    public void RemoveBullet(int amount)
    {
        bulletCount = Mathf.Max(0, bulletCount - amount);
        UpdateUI();
    }

    public void UpdateUI()
    {
        if (bulletCountText != null)
        {
            bulletCountText.text = bulletCount.ToString();
        }
    }
}
