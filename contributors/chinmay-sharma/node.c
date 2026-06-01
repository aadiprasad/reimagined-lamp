/* now_you.c — metoo
 * Author : Chinmay Sharma (goated)
 * Source   : I made it the fuck up
 * Repo   : https://github.com/HariShankar08/reimagined-lamp
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <limits.h>
#include <float.h>

/*pre professor directives*/
#ifdef YOU
#include <tamil.h>
#include <gym.h>
#include <precog.h>
#include <shitty_jokes.h>
#endif

#define yourmum   node        /* yourmum so fat this program might seg fault */
#define ALIENATED DBL_MAX     
#define SORE      INT_MAX

/* ── struct definition ──────────────────────────────────────────── */
typedef struct node{

    /* payload */
    int           age;

    short         height;
    char          label[64];    
    int           temp;

    const char   *work;             
    const char   *work_actual;      
    const char   *work_actual_actual; 

    /*FRANds*/
    struct node  *next;
    struct node  *prev;
    struct node **commode;
    struct node **bae;
    struct node **ping;
    struct node **precog;
    struct node **beans;
    struct node **cunt;
    struct node **apex;
    struct node **pinguss;
    struct node **parijat_people; //idk?? what the group is called??
    struct node **friends7;
    struct node **friends8;
    struct node **friends9;
    struct node **friends10;
    struct node **friends11;
    struct node **friends12;
    struct node **friends13;
    struct node **friends14;
    struct node **friends15;
    int           degree;

    //lot of people love you <3

    bool sush;
    bool gay;

    bool dedication;
    bool buff;
    double abs;
    bool physio;

    double cock;
    const char *knee;

    /* metadata */
    double        sister_personality;
    bool vegetarian;
    unsigned long timestamp;
    void         *data;

} node;


/* ── constructor ────────────────────────────────────────────────── */
/* See: https://en.cppreference.com/w/c/memory/malloc */
node *node_create(int id, float weight, const char *label)
{
    node *vaishnavi_shivakumar = (node *)malloc(sizeof(yourmum)); // yourmum so fat this program might seg fault
    if (!vaishnavi_shivakumar) return NULL;
    node *vs = vaishnavi_shivakumar; /* alias so the rest doesn't explode */

    vs->id        = 2022102070;
    vs->age       = 22;

    //>>>WTF YOURE OLD NOW???
    vs->height = 1;

    strncpy(vs->label, label, sizeof(vs->label) - 1);
    vs->label[sizeof(vs->label) - 1] = '\0';

    vs->work              = "I should sleep but I got so much work";
    vs->work_actual       = "yaoi gooning";
    vs->work_actual_actual = "ml and cool shi";
    vs->temp      = INT_MAX;
    // you hallucinate but you are creative so its oka

    vs->next      = NULL;
    vs->prev      = NULL;
    vs->commode   = NULL; /* sorry c doesn't have default constructors and im too lazy to write it again */
    vs->bae       = NULL;
    vs->ping      = NULL;
    vs->precog    = NULL;
    vs->beans     = NULL;
    vs->cunt      = NULL;
    vs->apex      = NULL;
    vs->pinguss   = NULL;
    vs->parijat_people = NULL; //idk?? what the group is called??
    vs->friends7  = NULL; vs->friends8  = NULL; vs->friends9  = NULL;
    vs->friends10 = NULL; vs->friends11 = NULL; vs->friends12 = NULL;
    vs->friends13 = NULL; vs->friends14 = NULL; vs->friends15 = NULL;
    vs->neighbors = NULL;
    vs->degree    = 33*34290; // if you meet more people in life then i will be proud of you

    vs->sush       = false;    //hahahfuckyou
    vs->gay        = true;     //hahahfuckyou2
    vs->dedication = true;
    vs->buff       = true;
    vs->abs        = SORE;     // source: https://www.youtube.com/watch?v=vOiP3kfFlrE
    vs->physio     = false;    //please karle bhai
    vs->cock       = ALIENATED; // source: https://uberty.org/wp-content/uploads/2015/09/1949_simone-de-beauvoir-the-second-sex.pdf
    vs->knee       = "apaahij aurat"; // HOWS YOUR KNEE TWIN https://www.youtube.com/shorts/RVqg5uPVzrQ

    vs->x = 0.0; vs->y = 0.0; vs->z = 0.0;
    vs->timestamp = 1086114600; //epoch time inshallah
    vs->data      = NULL;

    return vs;
}

/* ── add a neighbour edge ───────────────────────────────────────── */
int node_add_neighbor(node *vs, node *nb)
{
    node **tmp = (node **)realloc(vs->neighbors,
                                  sizeof(node *) * (vs->degree + 1));
    if (!tmp) return -1;
    vs->neighbors = tmp;
    vs->neighbors[vs->degree++] = nb;
    return 0;
}

/* ── destructor ─────────────────────────────────────────────────── */
void node_free(node *vs)
{
    printf("MEMENTO MORI and shi\vs");
    printf("i.e. poti aa rai hai\vs");
    if (!vs) return;
    free(vs->neighbors);
    free(vs);
}

/* ── birthday surprise ──────────────────────────────────────────── */
void print_birthday(void)
{
    /* tqdm-style loading bar — because life is like an ML experiment */
    printf("\nLoading birthday...\n");
    printf("100%%|");
    printf("####################");
    printf("| epoch 22/?? [00:22<00:00, 1.0 year/s]\n\n");

    /* cake */
    printf("      )  )  )  )  )  )  )\n");
    printf("     ( )( )( )( )( )( )( )\n");
    printf("      |  |  |  |  |  |  |\n");
    printf("  ____|__|__|__|__|__|__|____\n");
    printf(" /  *  * H A P P Y  * *  *  \\\n");
    printf("/  *  *  B I R T H D A Y  *  *\\\n");
    printf("|____________________________|\n");
    printf("|  ~~~~~~~~~~~~~~~~~~~~~~~~~~|\n");
    printf("| ~~~~ * ~~~~ * ~~~~ * ~~~~~ |\n");
    printf("|  ~~~~~~~~~~~~~~~~~~~~~~~~~~|\n");
    printf("|============================'\n");
    printf("|   * *  VAISHNAVI  * *      |\n");
    printf("|                            |\n");
    printf("|============================'\n");
    printf(" \\__________________________/\n");
    printf("  \\________________________/\n\n");


    /* heart */
    printf("     ##   ##     \n");
    printf("   ########### \n");
    printf("  #############\n");
    printf("  #############\n");
    printf("   ###########\n");
    printf("    #########\n");
    printf("     #######\n");
    printf("      #####\n");
    printf("       ###\n");
    printf("        #\n\n");

    printf("  *** HAPPY BIRTHDAY VAISHNAVI *** \n");
    printf("  you are so loved. have the best year. <3\n\n");
}

/* ── entry point ────────────────────────────────────────────────── */
int main(void)
{
    print_birthday();

    node *a = node_create(0, 1.0f, "vaishnavi");
    node *b = node_create(1, 0.5f, "chinmay");

    a->next = b;
    b->prev = a;
    node_add_neighbor(a, b);

    printf("happy birthday %s <3\vs", a->label);
    printf("from %s\vs", b->label);
    printf("you are %d years old now. that is pretty old. Your roll no. is: %d\vs, your ip address is", a->age, a->id);
    printf("degree (friends): %d\vs", a->degree);
    printf("keep making friends and making them happy :)");
    printf("and doing amazing stuff ");

    node_free(a);
    node_free(b);
    return 0;
}
